const form=document.querySelector('#early-access-form');
const status=document.querySelector('#request-status');
const button=form.querySelector('button[type="submit"]');
let pending=false,submission=null;
form.addEventListener('submit',async(event)=>{
  event.preventDefault();if(pending||!form.reportValidity())return;
  const data=new FormData(form);
  const details={name:String(data.get('name')||'').trim(),email:String(data.get('email')||'').trim(),message:String(data.get('message')||'').trim(),website:String(data.get('website')||''),consent:data.get('consent')==='on'};
  const key=JSON.stringify(details);
  if(!submission||submission.key!==key)submission={key,submissionId:crypto.randomUUID(),submittedAt:new Date().toISOString()};
  pending=true;button.disabled=true;button.textContent='Отправляем…';status.textContent='Сохраняем заявку. Пожалуйста, подождите.';status.dataset.state='pending';
  try {
    const response=await fetch('https://mcp.176-57-213-106.sslip.io/api/early-access',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...details,submissionId:submission.submissionId,submittedAt:submission.submittedAt}),signal:AbortSignal.timeout(15000)});
    const result=await response.json();
    if(!response.ok||result.ok!==true||!result.receipt){
      if(response.status===429)throw new Error('Слишком много заявок за короткое время. Попробуйте через 10 минут.');
      if(response.status===409)throw new Error('Данные заявки изменились. Обновите страницу и отправьте её заново.');
      throw new Error('Заявка не подтверждена. Попробуйте отправить ещё раз — данные в форме сохранены.');
    }
    form.hidden=true;status.dataset.state='success';status.textContent='Заявка принята. Напишем на указанный email и обсудим ваш проект. Доступ выдаём отдельно — регистрация ещё не создана.';
    status.focus();
  } catch(error){status.dataset.state='error';status.textContent=error.name==='Error'?error.message:'Не удалось связаться с сервером. Проверьте интернет и попробуйте ещё раз. Данные в форме сохранены.';}
  finally {pending=false;button.disabled=false;button.textContent='Отправить заявку';}
});
