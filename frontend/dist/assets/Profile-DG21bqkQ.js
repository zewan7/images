import{u as z,j as e,b as C,c as S,e as U}from"./index-C96Zm_Sn.js";import{r as i}from"./react-vendor-Ci7Csm7e.js";import{N as v}from"./Navbar-DgOobXlq.js";function A(){const{user:o,updateUser:j}=z(),[w,m]=i.useState(!0),[c,x]=i.useState(!1),[d,u]=i.useState(!1),[r,h]=i.useState({}),[l,g]=i.useState({}),[b,n]=i.useState(""),[N,t]=i.useState(""),y=async()=>{try{m(!0);const a=await C();h({full_name:a.full_name||"",bio:a.bio||"",avatar_url:a.avatar_url||""})}catch(a){console.error("Failed to load user profile:",a)}finally{m(!1)}};i.useEffect(()=>{y()},[]);const p=a=>{h(s=>({...s,[a.target.name]:a.target.value}))},f=a=>{g(s=>({...s,[a.target.name]:a.target.value}))},k=async a=>{a.preventDefault();try{const s=await S(r);j(s),x(!1),n("资料更新成功"),t("success"),setTimeout(()=>{n("")},3e3)}catch(s){console.error("Failed to update profile:",s),n("资料更新失败，请稍后重试"),t("error")}},_=async a=>{if(a.preventDefault(),l.new_password!==l.confirm_password){n("两次输入的密码不一致"),t("error");return}try{await U({current_password:l.current_password,new_password:l.new_password}),g({}),u(!1),n("密码修改成功"),t("success"),setTimeout(()=>{n("")},3e3)}catch(s){console.error("Failed to change password:",s),n("密码修改失败，请检查当前密码是否正确"),t("error")}};return w?e.jsxs("div",{children:[e.jsx(v,{}),e.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"50vh"},children:e.jsx("p",{children:"加载中..."})})]}):e.jsxs("div",{className:"profile-wrapper",children:[e.jsx(v,{}),e.jsxs("div",{className:"profile-container",children:[e.jsx("h1",{className:"profile-page-title",children:"个人资料"}),b&&e.jsx("div",{className:`message message-${N}`,children:b}),e.jsxs("div",{className:"profile-card",children:[e.jsx("div",{className:"profile-header-section",children:e.jsxs("div",{className:"avatar-container",children:[e.jsx("div",{className:"avatar-wrapper",children:r.avatar_url?e.jsx("img",{src:r.avatar_url,alt:"Avatar",className:"avatar-image"}):e.jsx("div",{className:"avatar-placeholder",children:e.jsx("span",{className:"avatar-initial",children:o.username.charAt(0).toUpperCase()})})}),e.jsx("h2",{className:"profile-name",children:r.full_name||o.username}),e.jsxs("p",{className:"profile-username",children:["@",o.username]})]})}),e.jsxs("div",{className:"profile-section",children:[e.jsxs("div",{className:"section-header",children:[e.jsx("h3",{className:"section-title",children:"基本信息"}),e.jsx("button",{className:`edit-button ${c?"cancel":""}`,onClick:()=>x(!c),children:c?"取消":"编辑资料"})]}),c?e.jsxs("form",{className:"profile-form",onSubmit:k,children:[e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"用户名"}),e.jsx("input",{type:"text",value:o.username,disabled:!0,className:"form-input disabled"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"邮箱"}),e.jsx("input",{type:"email",value:o.email,disabled:!0,className:"form-input disabled"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"全名"}),e.jsx("input",{type:"text",name:"full_name",value:r.full_name||"",onChange:p,placeholder:"请输入全名",className:"form-input"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"个人简介"}),e.jsx("textarea",{name:"bio",value:r.bio||"",onChange:p,placeholder:"请输入个人简介",rows:"4",className:"form-textarea"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"头像URL"}),e.jsx("input",{type:"text",name:"avatar_url",value:r.avatar_url||"",onChange:p,placeholder:"请输入头像URL",className:"form-input"})]}),e.jsx("div",{className:"form-actions",children:e.jsx("button",{type:"submit",className:"submit-button",children:"保存更改"})})]}):e.jsxs("div",{className:"profile-info",children:[e.jsxs("div",{className:"info-row",children:[e.jsx("span",{className:"info-label",children:"用户名"}),e.jsx("span",{className:"info-value",children:o.username})]}),e.jsxs("div",{className:"info-row",children:[e.jsx("span",{className:"info-label",children:"邮箱"}),e.jsx("span",{className:"info-value",children:o.email})]}),e.jsxs("div",{className:"info-row",children:[e.jsx("span",{className:"info-label",children:"全名"}),e.jsx("span",{className:"info-value",children:r.full_name||"未设置"})]}),e.jsxs("div",{className:"info-row",children:[e.jsx("span",{className:"info-label",children:"个人简介"}),e.jsx("span",{className:"info-value bio-value",children:r.bio||"未设置"})]}),e.jsxs("div",{className:"info-row",children:[e.jsx("span",{className:"info-label",children:"注册时间"}),e.jsx("span",{className:"info-value",children:new Date(o.created_at).toLocaleString()})]})]})]}),e.jsxs("div",{className:"profile-section",children:[e.jsxs("div",{className:"section-header",children:[e.jsx("h3",{className:"section-title",children:"密码管理"}),e.jsx("button",{className:`edit-button ${d?"cancel":""}`,onClick:()=>u(!d),children:d?"取消":"修改密码"})]}),d&&e.jsxs("form",{className:"profile-form password-form",onSubmit:_,children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"当前密码"}),e.jsx("input",{type:"password",name:"current_password",value:l.current_password||"",onChange:f,required:!0,placeholder:"请输入当前密码",className:"form-input"})]}),e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"新密码"}),e.jsx("input",{type:"password",name:"new_password",value:l.new_password||"",onChange:f,required:!0,placeholder:"请输入新密码",className:"form-input"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"确认新密码"}),e.jsx("input",{type:"password",name:"confirm_password",value:l.confirm_password||"",onChange:f,required:!0,placeholder:"请再次输入新密码",className:"form-input"})]})]}),e.jsx("div",{className:"form-actions",children:e.jsx("button",{type:"submit",className:"submit-button",children:"确认修改"})})]})]})]})]}),e.jsx("style",{jsx:!0,children:`
        .profile-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 33%, #16213e 66%, #0f3460 100%);
          background-size: 400% 400%;
          animation: gradientShift 20s ease infinite;
          position: relative;
          overflow: hidden;
        }
        
        /* 添加与Home页面相同的渐变动画 */
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .profile-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        
        .profile-page-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 30px 0;
          background: linear-gradient(135deg, #ffffff 0%, #4a90e2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        /* 消息提示 */
        .message {
          padding: 16px 20px;
          border-radius: 8px;
          margin-bottom: 24px;
          font-size: 14px;
          font-weight: 500;
        }
        
        .message-success {
          background-color: rgba(46, 204, 113, 0.2);
          color: #2ecc71;
          border-left: 4px solid #2ecc71;
        }
        
        .message-error {
          background-color: rgba(231, 76, 60, 0.2);
          color: #e74c3c;
          border-left: 4px solid #e74c3c;
        }
        
        /* 个人资料卡片 */
        .profile-card {
          background-color: #2d2d2d;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }
        
        /* 头像和基本信息 */
        .profile-header-section {
          background: linear-gradient(135deg, #4a90e2 0%, #2980b9 100%);
          padding: 40px;
          text-align: center;
        }
        
        .avatar-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .avatar-wrapper {
          position: relative;
          margin-bottom: 20px;
        }
        
        .avatar-image {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          border: 5px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease;
        }
        
        .avatar-image:hover {
          transform: scale(1.05);
        }
        
        .avatar-placeholder {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ffffff 0%, #f1f1f1 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 5px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .avatar-initial {
          font-size: 60px;
          font-weight: 800;
          color: #4a90e2;
        }
        
        .profile-name {
          font-size: 2rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 8px 0;
        }
        
        .profile-username {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }
        
        /* 资料部分 */
        .profile-section {
          padding: 30px;
          border-bottom: 1px solid #3a3a3a;
        }
        
        .profile-section:last-child {
          border-bottom: none;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        
        .section-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
        }
        
        /* 编辑按钮 */
        .edit-button {
          background-color: #4a90e2;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .edit-button:hover {
          background-color: #357abd;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
        }
        
        .edit-button.cancel {
          background-color: #e74c3c;
        }
        
        .edit-button.cancel:hover {
          background-color: #c0392b;
          box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
        }
        
        /* 表单样式 */
        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .form-label {
          font-size: 14px;
          font-weight: 500;
          color: #cccccc;
        }
        
        .form-input,
        .form-textarea {
          padding: 14px;
          background-color: #404040;
          color: #ffffff;
          border: 2px solid #555555;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s ease;
          outline: none;
        }
        
        .form-input:focus,
        .form-textarea:focus {
          border-color: #4a90e2;
          box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
        }
        
        .form-input.disabled {
          background-color: #353535;
          color: #888888;
          cursor: not-allowed;
        }
        
        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 10px;
        }
        
        .submit-button {
          background-color: #4a90e2;
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .submit-button:hover {
          background-color: #357abd;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
        }
        
        /* 信息展示 */
        .profile-info {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .info-row {
          display: grid;
          grid-template-columns: 150px 1fr;
          gap: 20px;
          align-items: center;
        }
        
        .info-label {
          font-size: 14px;
          font-weight: 500;
          color: #888888;
        }
        
        .info-value {
          font-size: 16px;
          color: #ffffff;
        }
        
        .bio-value {
          line-height: 1.6;
          white-space: pre-line;
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
          .profile-container {
            padding: 20px 16px;
          }
          
          .profile-page-title {
            font-size: 2rem;
          }
          
          .profile-header-section {
            padding: 30px 20px;
          }
          
          .profile-section {
            padding: 20px;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .info-row {
            grid-template-columns: 1fr;
            gap: 8px;
          }
          
          .avatar-image,
          .avatar-placeholder {
            width: 120px;
            height: 120px;
          }
          
          .avatar-initial {
            font-size: 50px;
          }
          
          .profile-name {
            font-size: 1.6rem;
          }
        }
      `})]})}export{A as default};
