const toSuper = (numStr) => {
  const map = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻'};
  return numStr.toString().split('').map(c => map[c] || c).join('');
};

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const generateQuiz = () => {
  const bases = ['x', 'y', 'a', 'b', 'm', 'n', 'p', 'q'];
  const getBase = () => bases[Math.floor(Math.random() * bases.length)];
  const getExp = (min=2, max=9) => Math.floor(Math.random()*(max-min+1))+min;
  
  let qList = [];
  const formatPower = (base, exp) => exp === 1 ? base : exp === 0 ? '1' : `${base}${toSuper(exp)}`;
  
  // Product Rule (2 questions)
  for(let i=0; i<2; i++) {
    const base = getBase();
    const e1 = getExp(2, 8);
    const e2 = getExp(2, 8);
    const ans = e1 + e2;
    const eq = `${formatPower(base, e1)} · ${formatPower(base, e2)}`;
    
    const opts = [ans, e1*e2, Math.abs(e1-e2), ans+1, ans-1, e1*e2+1];
    const uniqueOpts = Array.from(new Set(opts)).filter(o => o !== ans).slice(0,3);
    const options = [{text: formatPower(base, ans), isCorrect: true}];
    uniqueOpts.forEach(o => options.push({text: formatPower(base, o), isCorrect: false}));
    
    qList.push({
      type: 'mcq',
      text: 'Simplify using the Product Rule:',
      eq,
      options: shuffleArray(options),
      reviewText: `${eq} = ${base}${toSuper(e1)}+${toSuper(e2)} = ${formatPower(base, ans)}`
    });
  }
  
  // Quotient Rule (2 questions)
  for(let i=0; i<2; i++) {
    const base = getBase();
    const e1 = getExp(5, 12);
    const e2 = getExp(2, e1-1); // positive ans
    const ans = e1 - e2;
    const eq = `${formatPower(base, e1)} ÷ ${formatPower(base, e2)}`;
    
    const opts = [ans, e1+e2, e1*e2, Math.floor(e1/e2), ans+1];
    const uniqueOpts = Array.from(new Set(opts)).filter(o => o !== ans).slice(0,3);
    const options = [{text: formatPower(base, ans), isCorrect: true}];
    uniqueOpts.forEach(o => options.push({text: formatPower(base, o), isCorrect: false}));
    
    qList.push({
      type: 'mcq',
      text: 'Simplify using the Quotient Rule:',
      eq,
      options: shuffleArray(options),
      reviewText: `${eq} = ${base}${toSuper(e1)}-${toSuper(e2)} = ${formatPower(base, ans)}`
    });
  }
  
  // Power of a Power Rule (2 questions)
  for(let i=0; i<2; i++) {
    const base = getBase();
    const e1 = getExp(2, 6);
    const e2 = getExp(2, 5);
    const ans = e1 * e2;
    const eq = `(${formatPower(base, e1)})${toSuper(e2)}`;
    
    const opts = [ans, e1+e2, Math.pow(e1, e2), ans+1, ans-1];
    const uniqueOpts = Array.from(new Set(opts)).filter(o => o !== ans).slice(0,3);
    while(uniqueOpts.length < 3) uniqueOpts.push(ans + Math.floor(Math.random()*5)+1); 
    const options = [{text: formatPower(base, ans), isCorrect: true}];
    uniqueOpts.forEach(o => options.push({text: formatPower(base, o), isCorrect: false}));
    
    qList.push({
      type: 'mcq',
      text: 'Simplify using the Power of a Power Rule:',
      eq,
      options: shuffleArray(options),
      reviewText: `${eq} = ${base}${toSuper(e1)}·${toSuper(e2)} = ${formatPower(base, ans)}`
    });
  }

  // Zero Exponent Rule (2 questions)
  for(let i=0; i<2; i++) {
    const base = getBase();
    const coeff = getExp(2, 9);
    const isWholePower0 = Math.random() > 0.5;
    
    let eq, ansText, reviewText;
    if (isWholePower0) {
      eq = `(${coeff}${base}${toSuper(getExp(2,5))})⁰`;
      ansText = '1';
      reviewText = `Any non-zero expression raised to the power of 0 is equal to 1.`;
    } else {
      eq = `${coeff}${base}⁰`;
      ansText = `${coeff}`;
      reviewText = `The exponent 0 only applies to '${base}'. So ${base}⁰ = 1, and ${coeff} · 1 = ${coeff}.`;
    }
    
    let opts = [ansText, '0', `${coeff}${base}`, isWholePower0 ? `${coeff}` : '1', 'Undefined'];
    opts = Array.from(new Set(opts)).filter(o => o !== ansText);
    opts = shuffleArray(opts).slice(0, 3);
    
    const options = [{text: ansText, isCorrect: true}];
    opts.forEach(o => options.push({text: o, isCorrect: false}));
    
    qList.push({
      type: 'mcq',
      text: 'Evaluate using the Zero Exponent Rule:',
      eq,
      options: shuffleArray(options),
      reviewText
    });
  }

  // Negative Exponent Rule (2 questions)
  for(let i=0; i<2; i++) {
    const base = getBase();
    const e1 = getExp(2, 5);
    const eq = `${base}${toSuper('-' + e1)}`;
    const ansText = `1 / ${formatPower(base, e1)}`;
    
    let opts = [
      `1 / ${formatPower(base, e1)}`,
      `-${formatPower(base, e1)}`,
      `${base}${toSuper(e1)}`,
      `1 / ${formatPower(base, -e1)}`,
      `-${base} / ${e1}`
    ];
    
    opts = Array.from(new Set(opts)).filter(o => o !== ansText);
    opts = shuffleArray(opts).slice(0, 3);
    
    const options = [{text: ansText, isCorrect: true}];
    opts.forEach(o => options.push({text: o, isCorrect: false}));
    
    qList.push({
      type: 'mcq',
      text: 'Rewrite the expression with a positive exponent:',
      eq,
      options: shuffleArray(options),
      reviewText: `${eq} means taking the reciprocal: 1 / ${formatPower(base, e1)}.`
    });
  }
  
  qList = shuffleArray(qList);
  qList.forEach((q, idx) => { q.id = `q${idx+1}`; });
  
  return qList;
};

console.log("Generating quiz...");
try {
  console.log(JSON.stringify(generateQuiz(), null, 2));
  console.log("Success");
} catch(e) {
  console.error(e);
}
