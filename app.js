const RING={P0:250,P1:315,P2:380,'3V':445,GND:510},PORTX=[175,305,435,565];
const COL={red:'#E53935',yellow:'#F9B800',green:'#2FA24A',orange:'#F57C00',blue:'#2F6FD6',brown:'#7B4A2E',black:'#14181D'};
const LEDC={red:['#FF6B6B','#B71C1C'],yellow:['#FFD54A','#A87A00'],green:['#6BDB7E','#1B7F36']};
const INK='#10304A',MET='#9AA3AB';
const T=(x,y,t,o='')=>`<text x="${x}" y="${y}" font-size="15" fill="${INK}" ${o}>${t}</text>`;
const led=c=>{const[f,s]=LEDC[c];return `<path d="M-20 60V25A20 20 0 0 1 20 25V60Z" fill="${f}" stroke="${s}" stroke-width="3"/><rect x="-25" y="58" width="50" height="7" rx="2" fill="${f}" stroke="${s}" stroke-width="3"/><ellipse cx="-9" cy="30" rx="3" ry="9" fill="#fff" opacity=".6"/><path d="M20 30V58" stroke="${s}" stroke-width="5"/><path d="M-10 65V139" stroke="${MET}" stroke-width="4"/><path d="M10 65V114" stroke="${MET}" stroke-width="4"/>`};
const resistor=(x,y)=>`<path d="M${x} ${y}V${y+60}" stroke="${MET}" stroke-width="3"/><rect x="${x-8}" y="${y+10}" width="16" height="40" rx="6" fill="#E9CF9B" stroke="#8A6D2F" stroke-width="2"/>`+[[16,'#F57C00'],[23,'#F57C00'],[30,'#6D3A1A'],[42,'#D4AF37']].map(([o,c])=>`<rect x="${x-8}" y="${y+o}" width="16" height="4" fill="${c}"/>`).join('');
function microbit(rings){let s=`<rect x="210" y="14" width="340" height="190" rx="14" fill="#1E2229"/><text x="380" y="46" fill="#fff" font-size="22" font-weight="600" text-anchor="middle">micro:bit</text>`;
 for(let i=0;i<5;i++)for(let j=0;j<5;j++)s+=`<circle cx="${380+(i-2)*22}" cy="${92+(j-2)*22}" r="7" fill="${(i+j)%2&&j<3?'#FF5252':'#5B2323'}"/>`;
 s+=`<circle cx="256" cy="100" r="19" fill="#DDE2E7"/><text x="256" y="106" font-size="16" font-weight="600" text-anchor="middle" fill="${INK}">A</text><circle cx="504" cy="100" r="19" fill="#DDE2E7"/><text x="504" y="106" font-size="16" font-weight="600" text-anchor="middle" fill="${INK}">B</text>`;
 if(rings)for(const k in RING)s+=`<circle cx="${RING[k]}" cy="190" r="15" fill="#D9A400"/><circle cx="${RING[k]}" cy="190" r="6" fill="#1E2229"/><text x="${RING[k]}" y="164" font-size="15" font-weight="600" fill="#fff" text-anchor="middle">${k}</text>`;
 return s}
function board(){let s=`<rect x="100" y="172" width="560" height="150" rx="14" fill="#1F7A3A" stroke="#0F4D23" stroke-width="3"/><rect x="205" y="172" width="350" height="14" fill="#0A2E16"/><text x="380" y="310" font-size="17" font-weight="600" fill="#fff" text-anchor="middle">Expansion board</text>`;
 PORTX.forEach((x,i)=>{s+=`<text x="${x}" y="206" font-size="17" font-weight="600" fill="#fff" text-anchor="middle">P${i}</text><rect x="${x-36}" y="214" width="72" height="54" rx="6" fill="#1A1A1A"/><text x="${x-20}" y="234" font-size="13" fill="#ddd" text-anchor="middle">G</text><text x="${x}" y="234" font-size="13" fill="#ddd" text-anchor="middle">V</text><text x="${x+20}" y="234" font-size="13" fill="#ddd" text-anchor="middle">S</text><circle cx="${x-20}" cy="252" r="7" fill="#14181D" stroke="#fff" stroke-width="2"/><circle cx="${x}" cy="252" r="7" fill="#E53935" stroke="#fff" stroke-width="2"/><circle cx="${x+20}" cy="252" r="7" fill="#F9B800" stroke="#fff" stroke-width="2"/>`});
 return s}
function src(m,k){if(m==='alone')return[RING[k],224];const[p,o]=k.split('.');return[PORTX[+p[1]]+{G:-20,V:0,S:20}[o],252]}
function wire(w,m,A){const[sx,sy]=src(m,w.f[m]),a=A[w.to];const d=a.v?`M${sx} ${sy}C${sx} ${sy+60} ${a.v[0]} ${a.v[1]-60} ${a.v[0]} ${a.v[1]}${a.tail}`:`M${sx} ${sy}C${sx} ${sy+70} ${a.x} ${a.y-70} ${a.x} ${a.y}`;
 let c=m==='alone'?`<rect x="${sx-8}" y="198" width="16" height="28" rx="3" fill="${MET}" stroke="#555" stroke-width="2"/>`:'';
 return `<path class="w" data-k="${w.id}" d="${d}" stroke="${COL[w.c]}"/>`+c}
function traffic(Y,gx){let s='',A={};
 [[150,'red'],[290,'yellow'],[430,'green']].forEach(([cx,c])=>{s+=`<g transform="translate(${cx} ${Y})">${led(c)}</g>`+resistor(cx+10,Y+114)+`<path d="M${cx+10} ${Y+174}V${Y+200}" stroke="#14181D" stroke-width="5"/><circle cx="${cx+10}" cy="${Y+200}" r="5" fill="#14181D"/>`;A[c]={x:cx-10,y:Y+139,v:[cx-34,Y+90],tail:`V${Y+139}H${cx-10}`}});
 A.gnd={v:[gx,Y+200],tail:'H160'};
 const ix=gx+60;
 s+=T(ix-30,Y+8,'LED close-up','font-weight="600"')+`<g transform="translate(${ix} ${Y+16}) scale(1.2)">${led('red')}</g>`+T(ix+30,Y+52,'flat edge')+T(ix+30,Y+16+137+4,'short leg (−)')+T(ix-10,Y+208,'long leg (+)','text-anchor="middle"')+T(300,Y+232,'Resistor = 330 Ω (orange, orange, brown bands)','text-anchor="middle"');
 return[s,A]}
function servo(Y){const c=[[350,'orange'],[380,'red'],[410,'brown']];let s=`<rect x="330" y="${Y+4}" width="100" height="34" rx="4" fill="#222"/>`;
 c.forEach(([x,k])=>{s+=`<path d="M${x} ${Y+38}V${Y+84}" stroke="${COL[k]}" stroke-width="4"/><circle cx="${x}" cy="${Y+14}" r="6" fill="#D9A400"/>`});
 s+=`<rect x="262" y="${Y+104}" width="236" height="40" fill="#1F5FC5"/><rect x="290" y="${Y+84}" width="180" height="80" rx="6" fill="#1F5FC5"/><circle cx="276" cy="${Y+124}" r="5" fill="#fff"/><circle cx="484" cy="${Y+124}" r="5" fill="#fff"/><rect x="444" y="${Y+54}" width="12" height="36" rx="3" fill="#fff" stroke="#444" stroke-width="2"/><circle cx="450" cy="${Y+84}" r="16" fill="#fff" stroke="#444" stroke-width="3"/><circle cx="450" cy="${Y+84}" r="4" fill="#444"/><text x="360" y="${Y+132}" font-size="22" font-weight="600" fill="#fff" text-anchor="middle">SERVO</text>`;
 [['orange','signal'],['red','power'],['brown','ground']].forEach(([k,t],i)=>{s+=`<circle cx="450" cy="${Y+12+i*20}" r="6" fill="${COL[k]}"/>`+T(462,Y+17+i*20,t)});
 s+=T(380,Y+190,'The arm (horn) turns to the angle you choose.','text-anchor="middle"');
 return[s,{sig:{x:350,y:Y+12},pwr:{x:380,y:Y+12},gnd:{x:410,y:Y+12}}]}
function ultra(Y){const px=[325,365,405,445],n=['VCC','Trig','Echo','GND'];let s=`<rect x="265" y="${Y+16}" width="240" height="112" rx="5" fill="#1769AA"/>`;
 px.forEach((x,i)=>{s+=`<rect x="${x-6}" y="${Y+2}" width="12" height="16" fill="#D9A400"/><text x="${x}" y="${Y+44}" font-size="14" font-weight="600" fill="#fff" text-anchor="middle">${n[i]}</text>`});
 [320,450].forEach(x=>{s+=`<circle cx="${x}" cy="${Y+88}" r="30" fill="#C8CDD2" stroke="#5B6168" stroke-width="3"/><circle cx="${x}" cy="${Y+88}" r="20" fill="#8E969E"/>`});
 s+=T(385,Y+158,'Left eye sends sound. Right eye listens.','text-anchor="middle"');
 return[s,{vcc:{x:325,y:Y+8},trig:{x:365,y:Y+8},echo:{x:405,y:Y+8},gnd:{x:445,y:Y+8}}]}
function pir(Y){const px=[335,385,435],n=['VCC','OUT','GND'];let s=`<rect x="285" y="${Y+16}" width="200" height="124" rx="5" fill="#2E8B57"/>`;
 px.forEach((x,i)=>{s+=`<rect x="${x-6}" y="${Y+2}" width="12" height="16" fill="#D9A400"/><text x="${x}" y="${Y+44}" font-size="14" font-weight="600" fill="#fff" text-anchor="middle">${n[i]}</text>`});
 s+=`<circle cx="385" cy="${Y+96}" r="34" fill="#F7F7F2" stroke="#999" stroke-width="3"/><circle cx="385" cy="${Y+96}" r="16" fill="#E6E6DD" stroke="#bbb" stroke-width="2"/>`+T(385,Y+170,'The white dome is the sensor’s “eye”.','text-anchor="middle"');
 return[s,{vcc:{x:335,y:Y+8},out:{x:385,y:Y+8},gnd:{x:435,y:Y+8}}]}
const W=(id,c,a,b,to)=>({id,c,f:{alone:a,board:b},to});
const B=(k,t,i)=>[k,t,i];
const P={
traffic:{tab:'Traffic light',name:'Traffic light',intro:'Three LEDs turn on one after another, like a real traffic light.',
 wires:[W('red','red','P0','P0.S','red'),W('yellow','yellow','P1','P1.S','yellow'),W('green','green','P2','P2.S','green'),W('gnd','black','GND','P3.G','gnd')],
 parts:['micro:bit','3 LEDs (red, yellow, green)','3 resistors, 330 Ω','Black wire','Alligator clips or wires'],
 steps:{alone:[['Find the legs of an LED. The long leg is plus (+). The short leg is minus (−).',[]],['Clip the red wire from ring P0 to the long leg of the red LED.',['red']],['Yellow wire: ring P1 to the yellow LED. Green wire: ring P2 to the green LED.',['yellow','green']],['Put a 330 Ω resistor on each short leg.',[]],['Join the three resistors with a black wire. Clip it to ring GND.',['gnd']]],
 board:[['Find the legs of an LED. The long leg is plus (+). The short leg is minus (−).',[]],['Push the micro:bit into the slot of the expansion board.',[]],['Long legs go to the S pins: red to P0, yellow to P1, green to P2.',['red','yellow','green']],['Short legs go through resistors to a G pin (we used P3).',['gnd']]]},
 notes:{alone:'Always give each LED a resistor. It protects the LED.',board:'S = signal, V = power, G = ground. Check the colors on your board.'},
 blocks:[B('t','forever',0),B('p','digital write pin P0 to 1',1),B('b','pause (ms) 3000',1),B('p','digital write pin P0 to 0',1),B('p','digital write pin P2 to 1',1),B('b','pause (ms) 3000',1),B('p','digital write pin P2 to 0',1),B('p','digital write pin P1 to 1',1),B('b','pause (ms) 1000',1),B('p','digital write pin P1 to 0',1)],
 info:'1 turns a light ON. 0 turns it OFF. P0 is red, P1 is yellow, P2 is green.'},
servo:{tab:'Servo motor',name:'Servo motor',intro:'A servo turns its arm to an exact angle, from 0° to 180°.',
 wires:[W('sig','orange','P0','P0.S','sig'),W('pwr','red','3V','P0.V','pwr'),W('gnd','brown','GND','P0.G','gnd')],
 parts:['micro:bit','Servo motor','3 wires or clips'],
 steps:{alone:[['Look at the servo cable: orange = signal, red = power, brown = ground.',[]],['Orange wire: ring P0 to the orange contact.',['sig']],['Red wire: ring 3V to the red contact.',['pwr']],['Brown wire: ring GND to the brown contact.',['gnd']]],
 board:[['Look at the servo cable: orange = signal, red = power, brown = ground.',[]],['Push the micro:bit into the expansion board.',[]],['Plug the servo plug into port P0: brown to G, red to V, orange to S.',['sig','pwr','gnd']]]},
 notes:{alone:'Use one small servo only. Two servos need more power.',board:'The board gives the servo stronger power, so it moves smoothly.'},
 blocks:[B('t','forever',0),B('p','servo write pin P0 to 0',1),B('b','pause (ms) 1000',1),B('p','servo write pin P0 to 90',1),B('b','pause (ms) 1000',1),B('p','servo write pin P0 to 180',1),B('b','pause (ms) 1000',1)],
 info:'The number is the angle. Try 45 or 135 too!'},
ultra:{tab:'Distance sensor',name:'Ultrasonic distance sensor',intro:'It sends sound waves and listens for the echo to measure distance in centimeters.',
 wires:[W('vcc','red','3V','P1.V','vcc'),W('trig','orange','P1','P1.S','trig'),W('echo','blue','P2','P2.S','echo'),W('gnd','black','GND','P1.G','gnd')],
 parts:['micro:bit','HC-SR04 sensor','4 wires or clips'],
 steps:{alone:[['Read the four pin names on the sensor: VCC, Trig, Echo, GND.',[]],['Red wire: ring 3V to VCC.',['vcc']],['Orange wire: ring P1 to Trig. Blue wire: ring P2 to Echo.',['trig','echo']],['Black wire: ring GND to GND.',['gnd']]],
 board:[['Read the four pin names on the sensor: VCC, Trig, Echo, GND.',[]],['Push the micro:bit into the expansion board.',[]],['Red wire: V on P1 to VCC. Black wire: G on P1 to GND.',['vcc','gnd']],['Orange wire: S on P1 to Trig. Blue wire: S on P2 to Echo.',['trig','echo']]]},
 notes:{alone:'This sensor likes 5V. The micro:bit only gives 3V, so readings can be shaky.',board:'The V pins give 5V. That is why the sensor works best here.'},
 blocks:[B('t','forever',0),B('b','set distance to ping trig P1 echo P2 unit cm',1),B('g','if distance &lt; 10 then',1),B('b','show icon ♥',2),B('g','else',1),B('b','clear screen',2),B('b','pause (ms) 200',1)],
 info:'First add the sonar extension: Extensions, then search “sonar”.'},
pir:{tab:'Motion sensor',name:'PIR motion sensor',intro:'It feels body heat and tells the micro:bit when someone moves nearby.',
 wires:[W('vcc','red','3V','P0.V','vcc'),W('out','green','P0','P0.S','out'),W('gnd','black','GND','P0.G','gnd')],
 parts:['micro:bit','PIR sensor (HC-SR501)','3 wires or clips'],
 steps:{alone:[['Read the pin names on the sensor: VCC, OUT, GND.',[]],['Red wire: ring 3V to VCC.',['vcc']],['Green wire: ring P0 to OUT.',['out']],['Black wire: ring GND to GND.',['gnd']]],
 board:[['Read the pin names on the sensor: VCC, OUT, GND.',[]],['Push the micro:bit into the expansion board.',[]],['Plug it into port P0: red to V, green to S, black to G.',['vcc','out','gnd']]]},
 notes:{alone:'Many PIR sensors want 5V. If yours does not react, try the expansion board.',board:'Wait 30 seconds after power on. The sensor needs to warm up.'},
 blocks:[B('t','forever',0),B('g','if digital read pin P0 = 1 then',1),B('b','show icon ♥',2),B('g','else',1),B('b','clear screen',2),B('b','pause (ms) 100',1)],
 info:'The pin reads 1 when it sees movement and 0 when everything is still.'}};
const FN={traffic,servo,ultra,pir},BC={b:'#2F6FD6',p:'#7B3FA0',g:'#2E7D32',t:'#00796B'};
let proj='traffic',mode='alone';
const $=s=>document.querySelector(s);
function render(){const p=P[proj],al=mode==='alone',Y=al?250:360,gx=al?510:545;
 let s=`<svg viewBox="0 0 780 ${Y+250}" role="img" aria-label="${p.name}, ${al?'micro:bit alone':'with expansion board'}">`+microbit(al)+(al?'':board());
 const[c,A]=FN[proj](Y,gx);s+=c+p.wires.map(w=>wire(w,mode,A)).join('')+'</svg>';
 $('#fig').innerHTML=s;$('#title').textContent=p.name;$('#intro').textContent=p.intro;$('#note').textContent=p.notes[mode];
 $('#steps').innerHTML=p.steps[mode].map(([t,h])=>`<li><button data-hl="${h.join(',')}">${t}</button></li>`).join('');
 $('#parts').innerHTML=p.parts.map(t=>`<li>${t}</li>`).join('');
 $('#blocks').innerHTML=p.blocks.map(([k,t,i])=>`<div class="bk" style="background:${BC[k]};margin-left:${i*28}px">${t}</div>`).join('');$('#blockinfo').textContent=p.info;
 document.querySelectorAll('#projects button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.p===proj));
 document.querySelectorAll('#modes button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===mode))}
$('#projects').innerHTML=Object.entries(P).map(([k,p])=>`<button data-p="${k}">${p.tab}</button>`).join('');
$('#projects').onclick=e=>{const b=e.target.closest('button');if(b){proj=b.dataset.p;render()}};
$('#modes').onclick=e=>{const b=e.target.closest('button');if(b){mode=b.dataset.mode;render()}};
$('#steps').onclick=e=>{const b=e.target.closest('button');if(!b)return;const on=b.classList.contains('on'),svg=$('#fig svg'),ids=b.dataset.hl?b.dataset.hl.split(','):[];
 document.querySelectorAll('#steps button').forEach(x=>x.classList.remove('on'));svg.classList.remove('dim');svg.querySelectorAll('.w').forEach(w=>w.classList.remove('hl'));
 if(on||!ids.length)return;b.classList.add('on');svg.classList.add('dim');ids.forEach(i=>svg.querySelector(`.w[data-k="${i}"]`)?.classList.add('hl'))};
render();
