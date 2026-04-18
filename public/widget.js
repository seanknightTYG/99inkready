"use strict";(()=>{(function(){let c="https://api.REZIFY.99agents.agency/api/v1",p=document.currentScript||(function(){let n=document.getElementsByTagName("script");return n[n.length-1]})(),l=p.getAttribute("data-shop")||p.getAttribute("data-tenant-id"),d=p.getAttribute("data-primary-color")||"#3b82f6";if(!l){console.error("REZIFY Widget: Missing data-shop attribute");return}function b(){let n=localStorage.getItem("REZIFY_session");return n||(n="sid_"+Math.random().toString(36).substr(2,9)+Date.now().toString(36),localStorage.setItem("REZIFY_session",n)),n}let g=b(),e={isValid:!1,minimized:!1,draftsUsed:0,draftsRemaining:10,currentImage:null,currentDesignId:null,productType:"tshirt",prompt:"",loading:!1,gateOpen:!1},s=document.createElement("div");s.id="REZIFY-widget-root",s.style.position="fixed",s.style.bottom="20px",s.style.right="20px",s.style.zIndex="999999",document.body.appendChild(s);let t=s.attachShadow({mode:"open"});function r(){let n=`
      * { box-sizing: border-box; font-family: system-ui, -apple-system, sans-serif; }
      .widget-container { width: 360px; background: #fff; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); overflow: hidden; border: 1px solid #e5e7eb; display: flex; flex-direction: column; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); transform-origin: bottom right;}
      .header { background: #18181b; color: #fff; padding: 18px 20px; font-weight: 700; border-bottom: 3px solid ${d}; display: flex; justify-content: space-between; align-items: center;}
      .content { padding: 20px; position:relative;}
      .msg-box { background: #fee2e2; color: #991b1b; padding: 20px; border-radius: 8px; font-size: 14px; text-align: center; line-height: 1.5; font-weight:500;}
      label { display: block; font-size: 11px; font-weight: 700; color: #52525b; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;}
      select, textarea, input { width: 100%; border: 1px solid #e4e4e7; border-radius: 8px; padding: 10px 12px; font-size: 14px; margin-bottom: 16px; transition: border-color 0.2s, box-shadow 0.2s; outline: none; background: #fafafa;}
      select:focus, textarea:focus, input:focus { border-color: ${d}; box-shadow: 0 0 0 3px ${d}20; background: #fff;}
      textarea { resize: none; height: 70px; }
      .btn { width: 100%; background: ${d}; color: #fff; border: none; border-radius: 8px; padding: 12px; font-weight: 700; font-size: 15px; cursor: pointer; transition: opacity 0.2s, transform 0.1s; }
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
      .minimized { cursor: pointer; display: flex; align-items: center; justify-content: center; background: ${d}; color: white; width: 64px; height: 64px; border-radius: 32px; box-shadow: 0 8px 24px ${d}50; transition: transform 0.2s;}
      .minimized:hover { transform: scale(1.05); }
      .action-row { display: flex; gap: 12px; margin-bottom: 16px; }
      .action-row button { flex: 1; }
      #btn-back { background: #52525b; }
    `;if(!e.isValid){if(e.loading)return;t.innerHTML=`
        <style>${n}</style>
        <div class="widget-container">
          <div class="header">REZIFY</div>
          <div class="content">
            <div class="msg-box">
              This shop has not activated REZIFY.<br/><br/>
              <a href="https://99rezify.vercel.app" target="_blank" style="color:#b91c1c; font-weight:700;">Visit 99rezify.vercel.app to get started.</a>
            </div>
          </div>
        </div>
      `;return}if(e.minimized){t.innerHTML=`<style>${n}</style><div class="minimized" id="max-btn"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></div>`,t.getElementById("max-btn").onclick=()=>{e.minimized=!1,r()};return}let u="";e.draftsRemaining<=0&&!e.gateOpen&&(u=`
          <div class="gate-overlay">
            <div class="gate-title">Ready for Final Art?</div>
            <p style="font-size:13px; color:#52525b; text-align:center; margin-bottom:20px; font-weight:500;">You've generated 10 concepts! Enter your details to send this request directly to our shop.</p>
            <input type="text" id="lead-name" placeholder="Full Name" required autocomplete="name" />
            <input type="email" id="lead-email" placeholder="Email Address" required autocomplete="email" />
            <input type="tel" id="lead-phone" placeholder="Phone (Optional)" autocomplete="tel" />
            <button class="btn" id="lead-submit" style="margin-top:8px;">Submit Request</button>
          </div>
       `),t.innerHTML=`
      <style>${n}</style>
      <div class="widget-container">
        <div class="header">
          <span>AI Design Lab</span>
          <button id="min-btn" style="background:transparent; border:none; color:#a1a1aa; cursor:pointer; font-size:24px; padding:0; display:flex; align-items:center; justify-content:center; width:24px; height:24px; transition:color 0.2s;">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="content">
          ${u}
          ${e.currentImage?`
            <div class="img-display">
              <img src="${e.currentImage}" alt="Draft Concept" />
            </div>
            <div class="action-row">
               <button class="btn" id="btn-back">\u2190 Back</button>
               <button class="btn" id="btn-save">Save Concept</button>
            </div>
          `:`
            <label>Product Type</label>
            <select id="prod-type">
              <option value="tshirt" ${e.productType==="tshirt"?"selected":""}>T-Shirt</option>
              <option value="hoodie" ${e.productType==="hoodie"?"selected":""}>Hoodie</option>
              <option value="mug" ${e.productType==="mug"?"selected":""}>Mug</option>
              <option value="poster" ${e.productType==="poster"?"selected":""}>Poster / Banner</option>
              <option value="sticker" ${e.productType==="sticker"?"selected":""}>Sticker</option>
              <option value="yard_sign" ${e.productType==="yard_sign"?"selected":""}>Yard Sign</option>
            </select>

            <label>Describe your design</label>
            <textarea id="prompt-input" placeholder="A retro sunset with palm trees..." maxlength="500">${e.prompt}</textarea>

            <button class="btn" id="btn-generate" ${e.loading?"disabled":""}>
              ${e.loading?'<div class="spinner"></div>':"Generate Concept"}
            </button>
          `}
          <div class="counter">${e.draftsUsed} of 10 free concepts used</div>
        </div>
      </div>
    `;let m=t.getElementById("min-btn");if(m&&(m.onclick=()=>{e.minimized=!0,r()}),e.draftsRemaining<=0&&!e.gateOpen){let o=t.getElementById("lead-submit");o&&(o.onclick=async()=>{let i=t.getElementById("lead-name").value,a=t.getElementById("lead-email").value,f=t.getElementById("lead-phone").value;if(!i||!a)return alert("Name and email are required");o.innerHTML='<div class="spinner"></div>',o.disabled=!0;try{await fetch(`${c}/leads/capture`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tenant_id:l,session_id:g,name:i,email:a,phone:f})}),e.gateOpen=!0,r()}catch{alert("Error submitting request"),o.innerHTML="Submit Request",o.disabled=!1}});return}if(e.currentImage){let o=t.getElementById("btn-back");o&&(o.onclick=()=>{e.currentImage=null,r()});let i=t.getElementById("btn-save");i&&(i.onclick=async()=>{let a=i.innerHTML;i.innerHTML='<div class="spinner"></div>',i.disabled=!0;try{await fetch(`${c}/generate/save`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tenant_id:l,session_id:g,design_id:e.currentDesignId})}),e.currentImage=null,e.minimized=!0,alert("Concept saved! Our team will review it.")}catch{alert("Error saving concept")}finally{r()}})}else{let o=t.getElementById("btn-generate");o&&(o.onclick=async()=>{if(e.prompt=t.getElementById("prompt-input").value.trim(),e.productType=t.getElementById("prod-type").value,!e.prompt){t.getElementById("prompt-input").focus();return}e.loading=!0,r();try{let i=await fetch(`${c}/generate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tenant_id:l,session_id:g,prompt:e.prompt,product_type:e.productType})}),a=await i.json();if(!i.ok){if(a.code==="LEAD_GATE_REQUIRED"){e.draftsRemaining=0,r();return}throw new Error(a.error||"Failed to generate")}e.currentImage=a.image_url,e.currentDesignId=a.design_id,e.draftsUsed=a.drafts_used,e.draftsRemaining=a.drafts_remaining}catch(i){alert(i.message)}finally{e.loading=!1,r()}})}}e.loading=!0,fetch(`${c}/tenants/validate/${l}`).then(n=>n.json()).then(n=>{e.loading=!1,n.valid?(e.isValid=!0,e.minimized=!0):e.isValid=!1,r()}).catch(()=>{e.loading=!1,e.isValid=!1,r()})})();})();
