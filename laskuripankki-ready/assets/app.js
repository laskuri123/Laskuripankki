const calculators = [
  {id:"percentage", name:"Prosenttilaskuri", category:"Muut", description:"Laske prosenttiosuus, prosenttilisäys ja prosenttivähennys."},
  {id:"discount", name:"Alennuslaskuri", category:"Raha", description:"Laske alennuksen määrä ja lopullinen hinta."},
  {id:"vat", name:"ALV-laskuri", category:"Raha", description:"Laske veroton hinta, ALV:n määrä ja verollinen hinta."},
  {id:"average", name:"Keskiarvolaskuri", category:"Opiskelu", description:"Laske lukujen aritmeettinen keskiarvo."},
  {id:"compound", name:"Korkolaskuri", category:"Raha", description:"Arvioi koron vaikutus säästöihin korkoa korolle -periaatteella."},
  {id:"date", name:"Päivämäärälaskuri", category:"Aika", description:"Laske päivien määrä kahden päivämäärän välillä."},
  {id:"age", name:"Ikälaskuri", category:"Aika", description:"Laske ikä syntymäpäivän perusteella."},
  {id:"time", name:"Aikaerolaskuri", category:"Aika", description:"Laske kahden kellonajan välinen aikaero."},
  {id:"units", name:"Yksikkömuunnin", category:"Muut", description:"Muunna pituus-, paino- ja lämpötilayksiköitä."},
  {id:"km", name:"Kilometrikorvauslaskuri", category:"Raha", description:"Laske kilometrimäärän perusteella korvaussumma antamallasi korvaushinnalla."},
  {id:"salary", name:"Palkkalaskuri", category:"Raha", description:"Laske suuntaa-antava nettosumma omilla prosenttioletuksillasi."},
  {id:"budget", name:"Budjettilaskuri", category:"Raha", description:"Laske paljonko tuloista jää jäljelle menojen jälkeen."},
  {id:"study", name:"Opiskelutuntilaskuri", category:"Opiskelu", description:"Jaa tavoitetunnit päiville ja viikoille."}
];

const $ = (sel) => document.querySelector(sel);
const grid = $("#calculator-grid");
const noResults = $("#no-results");
const search = $("#search");
const dialog = $("#calculator-dialog");
const modalTitle = $("#modal-title");
const modalCategory = $("#modal-category");
const modalDescription = $("#modal-description");
const modalBody = $("#modal-body");
let activeCategory = "Kaikki";

function esc(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function renderCards(){
  const q = search.value.trim().toLowerCase();
  const list = calculators.filter(c =>
    (activeCategory === "Kaikki" || c.category === activeCategory) &&
    (c.name+" "+c.description+" "+c.category).toLowerCase().includes(q)
  );
  grid.innerHTML = list.map(c => `
    <article class="calc-card">
      <div class="card-meta">${esc(c.category)}</div>
      <h3>${esc(c.name)}</h3>
      <p>${esc(c.description)}</p>
      <button class="card-open" data-id="${c.id}">Avaa laskuri</button>
    </article>`).join("");
  noResults.classList.toggle("hidden", list.length > 0);
  document.querySelectorAll(".card-open").forEach(btn => btn.addEventListener("click", () => openCalculator(btn.dataset.id)));
}

function field(label, id, type="number", value="", attrs=""){
  return `<div class="field"><label for="${id}">${label}</label><input id="${id}" type="${type}" value="${value}" ${attrs}></div>`;
}

function form(content, button="Laske"){
  return `<div class="form-grid">${content}</div>
    <div class="form-actions"><button class="button primary" id="calc-submit" type="button">${button}</button></div>
    <div id="calc-result"></div>`;
}

function val(id){ return Number($(id).value); }
function fmt(n, decimals=2){
  if(!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("fi-FI",{maximumFractionDigits:decimals}).format(n);
}
function euro(n){ return `${fmt(n)} €`; }
function showResult(html, note=""){
  $("#calc-result").innerHTML = `<div class="result">${html}</div>${note?`<div class="note">${note}</div>`:""}`;
}

function openCalculator(id){
  const c = calculators.find(x=>x.id===id);
  modalTitle.textContent = c.name;
  modalCategory.textContent = c.category;
  modalDescription.textContent = c.description;
  modalBody.innerHTML = buildForm(id);
  dialog.showModal();
  wireCalculator(id);
}

function buildForm(id){
  switch(id){
    case "percentage":
      return form(
        field("Lähtöluku","p-number","number","100","step=\"any\"")+
        field("Prosentti","p-percent","number","15","step=\"any\""),
        "Laske"
      );
    case "discount":
      return form(
        field("Alkuperäinen hinta (€)","d-price","number","100","step=\"any\" min=\"0\"")+
        field("Alennus (%)","d-percent","number","20","step=\"any\" min=\"0\" max=\"100\""),
        "Laske hinta"
      );
    case "vat":
      return form(
        field("Hinta (€)","v-price","number","100","step=\"any\" min=\"0\"")+
        field("ALV (%)","v-vat","number","25.5","step=\"any\" min=\"0\"")+
        `<div class="field full"><label for="v-direction">Onko annettu hinta</label><select id="v-direction"><option value="gross">verollinen</option><option value="net">veroton</option></select></div>`,
        "Laske"
      );
    case "average":
      return form(`<div class="field full"><label for="a-values">Luvut (erota pilkuilla, puolipisteillä tai välilyönneillä)</label><input id="a-values" value="8, 9, 7.5, 10" inputmode="decimal"></div>`);
    case "compound":
      return form(
        field("Alkupääoma (€)","c-principal","number","1000","step=\"any\" min=\"0\"")+
        field("Vuotuinen korko (%)","c-rate","number","5","step=\"any\"")+
        field("Aika (vuotta)","c-years","number","10","step=\"any\" min=\"0\"")+
        field("Lisäys vuodessa (€)","c-contrib","number","0","step=\"any\" min=\"0\""),
        "Laske"
      );
    case "date":
      return form(
        field("Alkupäivä","date-start","date","")+
        field("Loppupäivä","date-end","date",""),
        "Laske päivät"
      );
    case "age":
      return form(
        field("Syntymäpäivä","age-birth","date",""),
        "Laske ikä"
      );
    case "time":
      return form(
        field("Alkuaika","t-start","time","08:00")+
        field("Loppuaika","t-end","time","16:00"),
        "Laske aikaero"
      );
    case "units":
      return `
        <div class="form-grid">
          ${field("Arvo","u-value","number","1","step=\"any\"")}
          <div class="field"><label for="u-from">Mistä</label><select id="u-from">
            <option value="m">Metri</option><option value="km">Kilometri</option><option value="cm">Senttimetri</option><option value="mi">Maili</option><option value="kg">Kilogramma</option><option value="g">Gramma</option><option value="lb">Naula (lb)</option><option value="c">Celsius</option><option value="f">Fahrenheit</option>
          </select></div>
          <div class="field"><label for="u-to">Mihin</label><select id="u-to">
            <option value="m">Metri</option><option value="km">Kilometri</option><option value="cm">Senttimetri</option><option value="mi">Maili</option><option value="kg">Kilogramma</option><option value="g">Gramma</option><option value="lb">Naula (lb)</option><option value="c">Celsius</option><option value="f">Fahrenheit</option>
          </select></div>
        </div>
        <div class="form-actions"><button class="button primary" id="calc-submit" type="button">Muunna</button></div><div id="calc-result"></div>`;
    case "km":
      return form(
        field("Kilometrit","k-km","number","100","step=\"any\" min=\"0\"")+
        field("Korvaus €/km","k-rate","number","0.50","step=\"any\" min=\"0\""),
        "Laske"
      );
    case "salary":
      return form(
        field("Bruttopalkka / kk (€)","s-gross","number","3000","step=\"any\" min=\"0\"")+
        field("Vero (%)","s-tax","number","20","step=\"any\" min=\"0\" max=\"100\"")+
        field("Muut pidätykset (%)","s-other","number","8","step=\"any\" min=\"0\" max=\"100\""),
        "Laske suuntaa-antava netto"
      );
    case "budget":
      return form(
        field("Kuukausitulot (€)","b-income","number","2500","step=\"any\" min=\"0\"")+
        field("Asuminen (€)","b-housing","number","800","step=\"any\" min=\"0\"")+
        field("Ruoka (€)","b-food","number","400","step=\"any\" min=\"0\"")+
        field("Liikkuminen (€)","b-travel","number","150","step=\"any\" min=\"0\"")+
        field("Muut menot (€)","b-other","number","300","step=\"any\" min=\"0\""),
        "Laske budjetti"
      );
    case "study":
      return form(
        field("Tavoitetunnit","st-hours","number","20","step=\"any\" min=\"0\"")+
        field("Päiviä","st-days","number","7","step=\"any\" min=\"1\""),
        "Laske päivittäinen tavoite"
      );
  }
}

function wireCalculator(id){
  $("#calc-submit").addEventListener("click", () => runCalculator(id));
  if(id==="date"){
    const now = new Date();
    const iso = d => d.toISOString().slice(0,10);
    $("#date-start").value = iso(new Date(now.getFullYear(),now.getMonth(),1));
    $("#date-end").value = iso(now);
  }
  if(id==="age"){
    const y = new Date().getFullYear()-20;
    $("#age-birth").value = `${y}-01-01`;
  }
}

function runCalculator(id){
  let result="", note="";
  try{
    if(id==="percentage"){
      const n=val("#p-number"), p=val("#p-percent"), part=n*p/100;
      result=`<span>${fmt(p)} % luvusta ${fmt(n)}</span><strong>${fmt(part)}</strong>`;
    } else if(id==="discount"){
      const price=val("#d-price"), p=val("#d-percent"), save=price*p/100;
      result=`<span>Alennus</span><strong>${euro(save)}</strong><span>Maksettavaa</span><strong>${euro(price-save)}</strong>`;
    } else if(id==="vat"){
      const price=val("#v-price"), rate=val("#v-vat"), dir=$("#v-direction").value;
      const base=dir==="net"?price:price/(1+rate/100);
      const vat=dir==="net"?price*rate/100:price-base;
      const gross=dir==="net"?price+vat:price;
      result=`<span>Veroton hinta</span><strong>${euro(base)}</strong><span>ALV</span><strong>${euro(vat)}</strong><span>Verollinen hinta</span><strong>${euro(gross)}</strong>`;
      note="Tarkista käytettävä verokanta aina ajantasaisesta virallisesta lähteestä.";
    } else if(id==="average"){
      const nums=$("#a-values").value.split(/[,;\\s]+/).map(s=>s.replace(",",".")).map(Number).filter(Number.isFinite);
      if(!nums.length) throw new Error();
      const avg=nums.reduce((a,b)=>a+b,0)/nums.length;
      result=`<span>${nums.length} luvun keskiarvo</span><strong>${fmt(avg,3)}</strong>`;
    } else if(id==="compound"){
      const P=val("#c-principal"), r=val("#c-rate")/100, years=val("#c-years"), c=val("#c-contrib");
      const annual = (1+r)**years;
      const fv = r===0 ? P+c*years : P*annual + c*((annual-1)/r);
      const deposits=P+c*years, interest=fv-deposits;
      result=`<span>Arvioitu loppusumma</span><strong>${euro(fv)}</strong><span>Koron osuus</span><strong>${euro(interest)}</strong>`;
      note="Tämä on matemaattinen arvio eikä huomioi veroja, kuluja tai vaihtelevaa tuottoa.";
    } else if(id==="date"){
      const a=new Date(`${$("#date-start").value}T00:00:00`), b=new Date(`${$("#date-end").value}T00:00:00`);
      const days=Math.round(Math.abs(b-a)/86400000);
      result=`<span>Päivien erotus</span><strong>${fmt(days,0)} päivää</strong>`;
    } else if(id==="age"){
      const birth=new Date(`${$("#age-birth").value}T00:00:00`); const now=new Date();
      let years=now.getFullYear()-birth.getFullYear();
      const birthdayThisYear=new Date(now.getFullYear(),birth.getMonth(),birth.getDate());
      if(now<birthdayThisYear) years--;
      result=`<span>Ikä</span><strong>${fmt(years,0)} vuotta</strong>`;
    } else if(id==="time"){
      const [sh,sm]=$("#t-start").value.split(":").map(Number), [eh,em]=$("#t-end").value.split(":").map(Number);
      let mins=(eh*60+em)-(sh*60+sm); if(mins<0) mins+=1440;
      result=`<span>Aikaero</span><strong>${Math.floor(mins/60)} h ${mins%60} min</strong>`;
    } else if(id==="units"){
      const x=val("#u-value"), from=$("#u-from").value, to=$("#u-to").value;
      let out;
      const length={m:1,km:1000,cm:0.01,mi:1609.344}, weight={kg:1,g:0.001,lb:0.45359237};
      if(length[from] && length[to]) out=x*length[from]/length[to];
      else if(weight[from] && weight[to]) out=x*weight[from]/weight[to];
      else if((from==="c"||from==="f")&&(to==="c"||to==="f")){
        out=from==="c"&&to==="f"?x*9/5+32:from==="f"&&to==="c"?(x-32)*5/9:x;
      } else throw new Error();
      result=`<span>${fmt(x)} ${esc(from.toUpperCase())} → ${esc(to.toUpperCase())}</span><strong>${fmt(out,4)}</strong>`;
    } else if(id==="km"){
      result=`<span>Korvauksen määrä</span><strong>${euro(val("#k-km")*val("#k-rate"))}</strong>`;
      note="Anna korvaushinnaksi ajantasainen virallinen kilometrikorvaus tai muu käyttämäsi sovittu hinta.";
    } else if(id==="salary"){
      const gross=val("#s-gross"), tax=val("#s-tax")/100, other=val("#s-other")/100;
      const net=gross*(1-tax-other);
      result=`<span>Suunnilleen käteen</span><strong>${euro(net)} / kk</strong><span>Pidätykset yhteensä</span><strong>${euro(gross-net)}</strong>`;
      note="Vain suuntaa-antava laskuri. Todellinen nettopalkka riippuu mm. verokortista ja muista pidätyksistä.";
    } else if(id==="budget"){
      const income=val("#b-income"), expenses=["#b-housing","#b-food","#b-travel","#b-other"].reduce((s,id)=>s+val(id),0);
      const left=income-expenses;
      result=`<span>Menot yhteensä</span><strong>${euro(expenses)}</strong><span>Jäljelle</span><strong>${euro(left)}</strong>`;
    } else if(id==="study"){
      const h=val("#st-hours"), d=val("#st-days");
      result=`<span>Päivittäinen tavoite</span><strong>${fmt(h/d,2)} h / päivä</strong><span>Viikoittainen tavoite</span><strong>${fmt(h/d*7,2)} h / viikko</strong>`;
    }
    showResult(result,note);
  }catch(e){
    showResult("<span>Tarkista syöttöarvot ja kokeile uudelleen.</span>");
  }
}

document.querySelectorAll(".tab").forEach(tab => tab.addEventListener("click", ()=>{
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  tab.classList.add("active");
  activeCategory=tab.dataset.category;
  renderCards();
}));
search.addEventListener("input",renderCards);
$("#close-dialog").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",e=>{ if(e.target===dialog) dialog.close(); });
$("#year").textContent=new Date().getFullYear();
renderCards();
