import logoUrl from '../LOGO ADT FIX.jpg';

const LOGO_ALT = 'ADTrans RealIndo';

const style = document.createElement('style');
style.textContent = `
  .adt-brand-logo{display:block;width:auto;height:42px;max-width:180px;object-fit:contain;object-position:left center}
  .pc-brand .adt-brand-logo{height:44px;max-width:220px}
  .login-page .brand .adt-brand-logo{height:58px;max-width:260px}
  .shell aside .brand .adt-brand-logo{height:48px;max-width:220px}
  @media(max-width:700px){.adt-brand-logo{height:36px;max-width:155px}.pc-brand .adt-brand-logo{height:38px;max-width:180px}}
`;
document.head.appendChild(style);

function applyLogo(){
  document.querySelectorAll('.brand, .pc-brand').forEach((brand)=>{
    if(brand.dataset.adtLogoApplied==='1') return;
    const img=document.createElement('img');
    img.className='adt-brand-logo';
    img.src=logoUrl;
    img.alt=LOGO_ALT;
    img.decoding='async';
    img.loading='eager';
    brand.replaceChildren(img);
    brand.dataset.adtLogoApplied='1';
  });
}

applyLogo();
new MutationObserver(applyLogo).observe(document.documentElement,{childList:true,subtree:true});
