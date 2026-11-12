(function(){
  var d=document, root=d.documentElement, W=window;
  root.classList.add('js');
  var reduce=W.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=W.matchMedia('(pointer:fine)').matches;

  /* ---------- intro curtain (once per session) ---------- */
  var intro=d.querySelector('.intro');
  if(intro){
    var seen=false; try{seen=sessionStorage.getItem('intro')==='1'}catch(e){}
    if(seen||reduce){root.classList.add('no-intro')}
    else{ setTimeout(function(){root.classList.add('intro-done'); try{sessionStorage.setItem('intro','1')}catch(e){}},950) }
  }

  /* ---------- hero intro ---------- */
  var hero=d.querySelector('.hero');
  if(hero){var dl=root.classList.contains('no-intro')?80:900;setTimeout(function(){hero.classList.add('go')},dl)}

  /* ---------- header ---------- */
  var hdr=d.querySelector('.hdr');
  function onScroll(){if(hdr)hdr.classList.toggle('scrolled',W.scrollY>12)}
  onScroll();W.addEventListener('scroll',onScroll,{passive:true});

  /* ---------- mobile nav ---------- */
  var burger=d.querySelector('.burger'), nav=d.querySelector('.nav');
  if(burger&&nav){
    burger.addEventListener('click',function(){var o=nav.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
    nav.addEventListener('click',function(e){if(e.target.closest('a')){nav.classList.remove('open');burger.setAttribute('aria-expanded','false')}});
    d.addEventListener('keydown',function(e){if(e.key==='Escape'){nav.classList.remove('open');burger.setAttribute('aria-expanded','false')}});
  }

  /* ---------- reveal ---------- */
  var rv=[].slice.call(d.querySelectorAll('.rv'));
  if('IntersectionObserver' in W&&!reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    rv.forEach(function(el){io.observe(el)});
  } else {rv.forEach(function(el){el.classList.add('in')})}

  /* ---------- counters ---------- */
  var counts=[].slice.call(d.querySelectorAll('.count'));
  if(counts.length&&'IntersectionObserver' in W){
    var co=new IntersectionObserver(function(es){es.forEach(function(e){
      if(!e.isIntersecting)return;co.unobserve(e.target);
      var el=e.target,to=+el.getAttribute('data-to'),t0=null;
      if(reduce){el.textContent=to;return}
      function step(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/1400);p=1-Math.pow(1-p,3);el.textContent=Math.round(to*p);if(p<1)requestAnimationFrame(step)}
      requestAnimationFrame(step);
    })},{threshold:.5});
    counts.forEach(function(c){co.observe(c)});
  }

  /* ---------- process progress ---------- */
  var proc=d.querySelector('.process');
  if(proc&&'IntersectionObserver' in W){
    var po=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){proc.style.setProperty('--prog','100%');po.disconnect()}})},{threshold:.3});
    po.observe(proc);
  }

  /* ---------- spotlight + cursor + magnetic + tilt (desktop only) ---------- */
  if(!reduce&&fine){
    root.classList.add('has-cur');
    var spot=d.querySelector('.spot'),cur=d.querySelector('.cur'),raf,mx=0,my=0;
    W.addEventListener('pointermove',function(e){
      mx=e.clientX;my=e.clientY;
      cancelAnimationFrame(raf);
      raf=requestAnimationFrame(function(){
        root.style.setProperty('--mx',mx+'px');root.style.setProperty('--my',my+'px');
        if(cur){cur.style.left=mx+'px';cur.style.top=my+'px'}
      });
    },{passive:true});
    d.addEventListener('pointerover',function(e){
      if(!cur)return;var t=e.target;
      cur.classList.toggle('on',!!t.closest('a,button,[role=button],.viewer'));
      cur.classList.toggle('txt',!!t.closest('p,h1,h2,h3,li,dd')&&!t.closest('a,button'));
    });
    d.addEventListener('pointerleave',function(){if(cur)cur.style.opacity=0});
    d.addEventListener('pointerenter',function(){if(cur)cur.style.opacity=''});

    d.querySelectorAll('.mag').forEach(function(b){
      b.addEventListener('pointermove',function(e){
        var r=b.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;
        b.style.transform='translate('+x*.18+'px,'+y*.22+'px)';
      });
      b.addEventListener('pointerleave',function(){b.style.transform=''});
    });

    d.querySelectorAll('.tilt').forEach(function(c){
      c.addEventListener('pointermove',function(e){
        var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        c.style.setProperty('--ry',(x*4)+'deg');c.style.setProperty('--rx',(-y*4)+'deg');
      });
      c.addEventListener('pointerleave',function(){c.style.removeProperty('--rx');c.style.removeProperty('--ry')});
    });
  }

  /* ---------- hero particle field ---------- */
  var cv=d.querySelector('.hero .field');
  if(cv&&!reduce&&cv.getContext){
    var ctx=cv.getContext('2d'),pts=[],w,h,dpr=Math.min(2,W.devicePixelRatio||1),px=-1e4,py=-1e4,running=true;
    function size(){w=cv.clientWidth;h=cv.clientHeight;cv.width=w*dpr;cv.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
      var n=Math.round(Math.min(110,w*h/14000));pts=[];for(var i=0;i<n;i++)pts.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.4+.4,o:Math.random()*.5+.2})}
    size();W.addEventListener('resize',size);
    hero.addEventListener('pointermove',function(e){var r=cv.getBoundingClientRect();px=e.clientX-r.left;py=e.clientY-r.top},{passive:true});
    hero.addEventListener('pointerleave',function(){px=py=-1e4});
    var vis=new IntersectionObserver(function(es){running=es[0].isIntersecting;if(running)requestAnimationFrame(draw)},{threshold:0});vis.observe(cv);
    function draw(){
      if(!running)return;
      ctx.clearRect(0,0,w,h);
      for(var i=0;i<pts.length;i++){var p=pts[i];
        var dx=px-p.x,dy=py-p.y,dd=dx*dx+dy*dy;
        if(dd<36000){var f=(1-dd/36000)*.06;p.vx-=dx*f*.01;p.vy-=dy*f*.01}
        p.x+=p.vx;p.y+=p.vy;p.vx*=.995;p.vy*=.995;
        if(p.x<-10)p.x=w+10;if(p.x>w+10)p.x=-10;if(p.y<-10)p.y=h+10;if(p.y>h+10)p.y=-10;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fillStyle='rgba(62,232,208,'+p.o+')';ctx.fill();
      }
      ctx.lineWidth=.6;
      for(i=0;i<pts.length;i++)for(var j=i+1;j<pts.length;j++){var a=pts[i],b=pts[j],ex=a.x-b.x,ey=a.y-b.y,e2=ex*ex+ey*ey;
        if(e2<16900){var al=(1-e2/16900)*.22;ctx.strokeStyle='rgba(62,232,208,'+al+')';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}
      if(px>-1e3){ctx.strokeStyle='rgba(62,232,208,.35)';for(i=0;i<pts.length;i++){var q=pts[i],qx=q.x-px,qy=q.y-py;if(qx*qx+qy*qy<32000){ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(q.x,q.y);ctx.stroke()}}}
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  /* ---------- active nav ---------- */
  var links=[].slice.call(d.querySelectorAll('.nav a[href^="#"]'));
  if(links.length&&'IntersectionObserver' in W){
    var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var so=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){links.forEach(function(a){a.removeAttribute('aria-current')});var a=map[e.target.id];if(a)a.setAttribute('aria-current','true')}
    })},{rootMargin:'-45% 0px -50% 0px'});
    Object.keys(map).forEach(function(id){var s=d.getElementById(id);if(s)so.observe(s)});
  }

  /* ---------- click-to-load 3D viewer ---------- */
  d.querySelectorAll('[data-viewer]').forEach(function(box){
    var btn=box.querySelector('button');
    btn.addEventListener('click',function(){
      var f=d.createElement('iframe');
      f.src=box.getAttribute('data-viewer');f.title=box.getAttribute('data-title')||'Interactive 3D viewer';
      f.loading='lazy';f.allow='fullscreen';
      box.querySelector('.veil').remove();box.querySelector('img').remove();box.appendChild(f);f.focus();
    });
  });

  /* ---------- copy email ---------- */
  d.querySelectorAll('[data-copy]').forEach(function(b){
    b.addEventListener('click',function(){
      var t=b.getAttribute('data-copy'),lab=b.querySelector('span')||b,old=lab.textContent;
      function done(){lab.textContent='Copied ✓';setTimeout(function(){lab.textContent=old},1800)}
      if(navigator.clipboard){navigator.clipboard.writeText(t).then(done,function(){})}else{done()}
    });
  });

  var y=d.getElementById('yr');if(y)y.textContent=new Date().getFullYear();
})();

/* ================= v3: trend pass ================= */
(function(){
  var d=document,W=window,root=d.documentElement;
  var reduce=W.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=W.matchMedia('(pointer:fine)').matches;

  /* nav roll text */
  d.querySelectorAll('.nav a:not(.btn-sm)').forEach(function(a){
    var t=a.textContent.trim();a.innerHTML='<span class="roll"><span data-t="'+t+'">'+t+'</span></span>';a.setAttribute('aria-label',t);
  });

  /* split section headings into words */
  d.querySelectorAll('.sec-head h2, .contact h2, .sticky h2, .about h2').forEach(function(h){
    var i=0;
    (function walk(node){
      [].slice.call(node.childNodes).forEach(function(n){
        if(n.nodeType===3){
          var frag=d.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function(part){
            if(!part)return;
            if(/^\s+$/.test(part)){frag.appendChild(d.createTextNode(part));return}
            var s=d.createElement('span');s.className='w';s.style.setProperty('--i',i++);s.textContent=part;frag.appendChild(s);
          });
          n.parentNode.replaceChild(frag,n);
        } else if(n.nodeType===1&&!n.classList.contains('idx')) walk(n);
      });
    })(h);
    h.classList.add('split-w');
  });

  /* case hero h1 into chars */
  d.querySelectorAll('.case-hero h1').forEach(function(h){
    var t=h.textContent,i=0;h.setAttribute('aria-label',t);
    h.innerHTML=t.split('').map(function(c){return c===' '?' ':'<span class="ch" aria-hidden="true" style="--i:'+(i++)+'">'+c+'</span>'}).join('');
  });

  /* image wipes */
  d.querySelectorAll('.card-art:has(img), .feature-img, .viewer, .frame').forEach(function(el){el.classList.add('wipe')});

  /* observe new reveal targets */
  var targets=[].slice.call(d.querySelectorAll('.split-w, .wipe, .case-hero h1'));
  if('IntersectionObserver' in W&&!reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15});
    targets.forEach(function(t){io.observe(t)});
  } else targets.forEach(function(t){t.classList.add('in')});

  /* text scramble on mono labels */
  var glyphs='!<>-_\\/[]{}—=+*^?#01';
  function scramble(el){
    var final=el.textContent,len=final.length,frame=0,total=22;
    (function tick(){
      var out='';for(var i=0;i<len;i++){var reveal=(frame/total)*len;out+=(i<reveal||final[i]===' '||final[i]==='·')?final[i]:glyphs[(Math.random()*glyphs.length)|0]}
      el.textContent=out;if(frame++<total)requestAnimationFrame(tick);else el.textContent=final;
    })();
  }
  if(!reduce&&'IntersectionObserver' in W){
    var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){scramble(e.target);so.unobserve(e.target)}})},{threshold:.6});
    d.querySelectorAll('.card .num, .idx, .process .step, .when, .feature-body>.mono').forEach(function(el){so.observe(el)});
  }

  /* cursor-tracked glow */
  if(fine&&!reduce){
    d.querySelectorAll('.card, .mini a, .mini article, .feature').forEach(function(el){
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.style.setProperty('--gx',(e.clientX-r.left)+'px');el.style.setProperty('--gy',(e.clientY-r.top)+'px')});
    });
  }

  /* scroll-linked: progress bar, footer wordmark, card art parallax */
  var prog=d.querySelector('.prog'),big=d.querySelector('.bigname span'),arts=[].slice.call(d.querySelectorAll('.card-art svg')),ticking=false;
  function onS(){
    var h=root.scrollHeight-W.innerHeight,y=W.scrollY;
    if(prog)prog.style.setProperty('--sp',h>0?Math.min(1,y/h):0);
    if(big&&!reduce){var r=big.getBoundingClientRect(),p=Math.max(0,Math.min(1,1-(r.top/W.innerHeight)));
      big.style.setProperty('--by',(20-20*p)+'%');big.style.setProperty('--bp',(120-140*p)+'%')}
    if(!reduce)arts.forEach(function(s){var r=s.getBoundingClientRect(),c=(r.top+r.height/2-W.innerHeight/2)/W.innerHeight;s.style.transform='translateY('+(c*-24)+'px)'});
    ticking=false;
  }
  W.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onS)}},{passive:true});
  onS();
})();
