(function() {
  const API_BASE = 'https://api.rezify.io/api/v1';

  const currentScript = document.currentScript || (function() {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  const shopId = currentScript.getAttribute('data-shop') || currentScript.getAttribute('data-tenant-id');
  const customColor = currentScript.getAttribute('data-primary-color') || '#3b82f6'; 

  if (!shopId) {
    console.error('Rezify.io Widget: Missing data-shop attribute');
    return;
  }

  function getSessionId() {
    let sid = localStorage.getItem('REZIFY_session');
    if (!sid) {
      sid = 'sid_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
      localStorage.setItem('REZIFY_session', sid);
    }
    return sid;
  }
  const sessionId = getSessionId();

  let state = {
    isValid: false,
    minimized: false,
    draftsUsed: 0,
    draftsRemaining: 10,
    currentImage: null,
    currentDesignId: null,
    productType: 'tshirt',
    prompt: '',
    loading: false,
    gateOpen: false
  };

  const container = document.createElement('div');
  container.id = 'REZIFY-widget-root';
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style.right = '20px';
  container.style.zIndex = '999999';
  document.body.appendChild(container);

  const shadow = container.attachShadow({ mode: 'open' });

  function render() {
    const style = `
      * { box-sizing: border-box; font-family: system-ui, -apple-system, sans-serif; }
      .widget-container { width: 360px; background: #fff; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); overflow: hidden; border: 1px solid #e5e7eb; display: flex; flex-direction: column; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); transform-origin: bottom right;}
      .header { background: #18181b; color: #fff; padding: 18px 20px; font-weight: 700; border-bottom: 3px solid ${customColor}; display: flex; justify-content: space-between; align-items: center;}
      .content { padding: 20px; position:relative;}
      .msg-box { background: #fee2e2; color: #991b1b; padding: 20px; border-radius: 8px; font-size: 14px; text-align: center; line-height: 1.5; font-weight:500;}
      label { display: block; font-size: 11px; font-weight: 700; color: #52525b; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;}
      select, textarea, input { width: 100%; border: 1px solid #e4e4e7; border-radius: 8px; padding: 10px 12px; font-size: 14px; margin-bottom: 16px; transition: border-color 0.2s, box-shadow 0.2s; outline: none; background: #fafafa;}
      select:focus, textarea:focus, input:focus { border-color: ${customColor}; box-shadow: 0 0 0 3px ${customColor}20; background: #fff;}
      textarea { resize: none; height: 70px; }
      .btn { width: 100%; background: ${customColor}; color: #fff; border: none; border-radius: 8px; padding: 12px; font-weight: 700; font-size: 15px; cursor: pointer; transition: opacity 0.2s, transform 0.1s; }
      .btn:hover { opacity: 0.9; }
      .btn:active { transform: scale(0.98); }
      .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none;}
      .img-display { width: 100%; height: 220px; background: #f4f4f5; border-radius: 12px; margin-bottom: 16px; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;}
      .img-display img { width: 100%; height: 100%; object-fit: contain; }
      .counter { font-size: 12px; color: #71717a; text-align: center; margin-top: 12px; font-weight: 500; }
      .spinner { border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; border-top: 3px solid #fff; width: 20px; height: 20px; animation: spin 1s linear infinite; margin: 0 auto;}
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      .gate-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.98); display: flex; flex-direction: column; padding: 24px; justify-content: center; z-index: 10; border-radius: 0 0 16px 16px;}
      .gate-title { font-size: 18px; font-weight: 800; margin-bottom: 8px; color: #18181b; text-align: center;}
      .minimized { cursor: pointer; display: flex; align-items: center; justify-content: center; background: ${customColor}; color: white; width: 64px; height: 64px; border-radius: 32px; box-shadow: 0 8px 24px ${customColor}50; transition: transform 0.2s;}
      .minimized:hover { transform: scale(1.05); }
      .action-row { display: flex; gap: 12px; margin-bottom: 16px; }
      .action-row button { flex: 1; }
      #btn-back { background: #52525b; }
    `;

    if (!state.isValid) {
      if (state.loading) return; // Wait for initial fetch
      shadow.innerHTML = `
        <style>${style}</style>
        <div class="widget-container">
          <div class="header">Rezify.io</div>
          <div class="content">
            <div class="msg-box">
              This shop has not activated Rezify.io.<br/><br/>
              <a href="https://rezify.io" target="_blank" style="color:#b91c1c; font-weight:700;">Visit rezify.io to get started.</a>
            </div>
          </div>
        </div>
      `;
      return;
    }

    if (state.minimized) {
        shadow.innerHTML = `<style>${style}</style><div class="minimized" id="max-btn"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></div>`;
        shadow.getElementById('max-btn').onclick = () => { state.minimized = false; render(); };
        return;
    }

    let gateHtml = '';
    if (state.draftsRemaining <= 0 && !state.gateOpen) {
       gateHtml = `
          <div class="gate-overlay">
            <div class="gate-title">Ready for Final Art?</div>
            <p style="font-size:13px; color:#52525b; text-align:center; margin-bottom:20px; font-weight:500;">You've generated 10 concepts! Enter your details to send this request directly to our shop.</p>
            <input type="text" id="lead-name" placeholder="Full Name" required autocomplete="name" />
            <input type="email" id="lead-email" placeholder="Email Address" required autocomplete="email" />
            <input type="tel" id="lead-phone" placeholder="Phone (Optional)" autocomplete="tel" />
            <button class="btn" id="lead-submit" style="margin-top:8px;">Submit Request</button>
          </div>
       `;
    }

    shadow.innerHTML = `
      <style>${style}</style>
      <div class="widget-container">
        <div class="header">
          <span>AI Design Lab</span>
          <button id="min-btn" style="background:transparent; border:none; color:#a1a1aa; cursor:pointer; font-size:24px; padding:0; display:flex; align-items:center; justify-content:center; width:24px; height:24px; transition:color 0.2s;">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="content">
          ${gateHtml}
          ${state.currentImage ? `
            <div class="img-display">
              <img src="${state.currentImage}" alt="Draft Concept" />
            </div>
            <div class="action-row">
               <button class="btn" id="btn-back">← Back</button>
               <button class="btn" id="btn-save">Save Concept</button>
            </div>
          ` : `
            <label>Product Type</label>
            <select id="prod-type">
              <option value="tshirt" ${state.productType === 'tshirt' ? 'selected' : ''}>T-Shirt</option>
              <option value="hoodie" ${state.productType === 'hoodie' ? 'selected' : ''}>Hoodie</option>
              <option value="mug" ${state.productType === 'mug' ? 'selected' : ''}>Mug</option>
              <option value="poster" ${state.productType === 'poster' ? 'selected' : ''}>Poster / Banner</option>
              <option value="sticker" ${state.productType === 'sticker' ? 'selected' : ''}>Sticker</option>
              <option value="yard_sign" ${state.productType === 'yard_sign' ? 'selected' : ''}>Yard Sign</option>
            </select>

            <label>Describe your design</label>
            <textarea id="prompt-input" placeholder="A retro sunset with palm trees..." maxlength="500">${state.prompt}</textarea>

            <button class="btn" id="btn-generate" ${state.loading ? 'disabled' : ''}>
              ${state.loading ? '<div class="spinner"></div>' : 'Generate Concept'}
            </button>
          `}
          <div class="counter">${state.draftsUsed} of 10 free concepts used</div>
        </div>
      </div>
    `;

    const minBtn = shadow.getElementById('min-btn');
    if (minBtn) minBtn.onclick = () => { state.minimized = true; render(); };

    if (state.draftsRemaining <= 0 && !state.gateOpen) {
      const submitBtn = shadow.getElementById('lead-submit');
      if (submitBtn) {
        submitBtn.onclick = async () => {
          const name = shadow.getElementById('lead-name').value;
          const email = shadow.getElementById('lead-email').value;
          const phone = shadow.getElementById('lead-phone').value;
          if (!name || !email) return alert('Name and email are required');
          
          submitBtn.innerHTML = '<div class="spinner"></div>';
          submitBtn.disabled = true;
          try {
            await fetch(`${API_BASE}/leads/capture`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ tenant_id: shopId, session_id: sessionId, name, email, phone })
            });
            state.gateOpen = true;
            render();
          } catch (e) {
            alert('Error submitting request');
            submitBtn.innerHTML = 'Submit Request';
            submitBtn.disabled = false;
          }
        };
      }
      return;
    }

    if (!state.currentImage) {
      const genBtn = shadow.getElementById('btn-generate');
      if (genBtn) {
        genBtn.onclick = async () => {
          state.prompt = shadow.getElementById('prompt-input').value.trim();
          state.productType = shadow.getElementById('prod-type').value;
          
          if (!state.prompt) {
            shadow.getElementById('prompt-input').focus();
            return;
          }

          state.loading = true;
          render();

          try {
            const r = await fetch(`${API_BASE}/generate`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                tenant_id: shopId, 
                session_id: sessionId, 
                prompt: state.prompt, 
                product_type: state.productType 
              })
            });
            const res = await r.json();
            
            if (!r.ok) {
              if (res.code === 'LEAD_GATE_REQUIRED') {
                 state.draftsRemaining = 0; 
                 render();
                 return;
              }
              throw new Error(res.error || 'Failed to generate');
            }
            
            state.currentImage = res.image_url;
            state.currentDesignId = res.design_id;
            state.draftsUsed = res.drafts_used;
            state.draftsRemaining = res.drafts_remaining;
          } catch (e) {
            alert(e.message);
          } finally {
            state.loading = false;
            render();
          }
        };
      }
    } else {
      const backBtn = shadow.getElementById('btn-back');
      if (backBtn) backBtn.onclick = () => {
        state.currentImage = null;
        render();
      };
      
      const saveBtn = shadow.getElementById('btn-save');
      if (saveBtn) saveBtn.onclick = async () => {
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<div class="spinner"></div>';
        saveBtn.disabled = true;
        try {
          await fetch(`${API_BASE}/generate/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              tenant_id: shopId, 
              session_id: sessionId, 
              design_id: state.currentDesignId 
            })
          });
          state.currentImage = null;
          state.minimized = true;
          alert('Concept saved! Our team will review it.');
        } catch (e) {
          alert('Error saving concept');
        } finally {
          render();
        }
      };
    }
  }

  // Initial load
  state.loading = true;
  fetch(`${API_BASE}/tenants/validate/${shopId}`)
    .then(r => r.json())
    .then(data => {
      state.loading = false;
      if (data.valid) {
        state.isValid = true;
        state.minimized = true; 
      } else {
        state.isValid = false;
      }
      render();
    })
    .catch(() => {
      state.loading = false;
      state.isValid = false;
      render();
    });

})();
