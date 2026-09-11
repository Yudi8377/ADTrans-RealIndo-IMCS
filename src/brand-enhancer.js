import logoUrl from '../LOGO ADT FIX.jpg';

const LOGO_ALT = 'ADTrans RealIndo';

const style = document.createElement('style');
style.textContent = `
  .adt-brand-logo{display:block;flex:0 0 auto;width:44px;height:44px;object-fit:contain;object-position:center;border-radius:6px}
  .pc-brand{gap:12px}
  .pc-brand .adt-brand-logo{width:44px;height:44px}
  .login-page .brand .adt-brand-logo{width:58px;height:58px}
  .shell aside .brand .adt-brand-logo{width:48px;height:48px}
  @media(max-width:700px){
    .adt-brand-logo{width:38px;height:38px}
    .pc-brand .adt-brand-logo{width:40px;height:40px}
  }
`;
document.head.appendChild(style);

function makeLogo(){
  const img=document.createElement('img');
  img.className='adt-brand-logo';
  img.src=logoUrl;
  img.alt=LOGO_ALT;
  img.decoding='async';
  img.loading='eager';
  img.onerror=()=>{img.style.display='none';};
  return img;
}

function applyLogo(){
  document.querySelectorAll('.pc-brand').forEach((brand)=>{
    if(brand.querySelector('.adt-brand-logo')) return;
    const mark=brand.querySelector('.pc-mark');
    if(mark) mark.replaceWith(makeLogo());
    else brand.prepend(makeLogo());
  });

  document.querySelectorAll('.brand').forEach((brand)=>{
    if(brand.querySelector('.adt-brand-logo')) return;
    const mark=brand.querySelector(':scope > span:first-child');
    if(mark) mark.replaceWith(makeLogo());
    else brand.prepend(makeLogo());
  });
}

applyLogo();
new MutationObserver(applyLogo).observe(document.documentElement,{childList:true,subtree:true});
