export function Illustration({scene=0,hero=false}:{scene?:number;hero?:boolean}) {
 const danger=scene===5; const label=hero?'Illustration einer Stehleiter mit Pflanzen und Werkzeugen, ohne aufsteigende Person': danger?'Unsicher: Stehleiter mit beschädigtem Fuß auf loser Unterlage neben einer offenen Tür': ['Tritt und Stehleiter als Arbeitsmittel','Nahansicht einer Leiter: Holme, Stufen und Füße ansehen','Stehleiter mit gespannter Spreizsicherung auf festem Boden','Leiter neu aufstellen, um die Arbeitsstelle ohne Hinauslehnen zu erreichen','Arbeitsbereich vor Beginn kontrollieren'][scene] || 'Leitersicherheit';
 return <svg className={hero?'illustration hero-illustration':'illustration'} viewBox="0 0 600 390" role="img" aria-label={label}>
 <defs><linearGradient id="wall" x2="0" y2="1"><stop stopColor="#eaf0e9"/><stop offset="1" stopColor="#d8e4d6"/></linearGradient><linearGradient id="metal"><stop stopColor="#95a7a2"/><stop offset=".5" stopColor="#e1e8df"/><stop offset="1" stopColor="#8c9e97"/></linearGradient></defs>
 <circle cx="334" cy="175" r="165" fill="#dfe9dc"/><path d="M90 324H551" stroke="#a8b9ac" strokeWidth="2"/><ellipse cx="306" cy="328" rx="136" ry="12" fill="#b9c9bb" opacity=".45"/>
 <path d="M391 320V112h91v208" fill="url(#wall)" stroke="#c8d7c9" strokeWidth="2"/><path d="M400 119h75v139h-75z" fill="#e9eee5"/><path d="M400 267h75" stroke="#c1d2c2" strokeWidth="3"/><circle cx="465" cy="218" r="3" fill="#6e8b79"/>
 <path d="M184 318L266 92h18l-78 226z" fill="url(#metal)" stroke="#7d9286" strokeWidth="2"/><path d="M284 94l88 224h-20L269 95z" fill="#8fa194" stroke="#7d9286" strokeWidth="2"/>
 <path d="M269 82l60 236h-19L250 82z" fill="url(#metal)" stroke="#71877a" strokeWidth="2"/>
 {[0,1,2,3,4].map((n)=><g key={n}><path d={`M${251-n*12} ${126+n*35}h${34+n*20}v10h-${34+n*20}z`} fill="#b8c6b9" stroke="#7f9586" strokeWidth="1.5"/><path d={`M${252-n*12} ${126+n*35}h${34+n*20}`} stroke="#ecf1e8" strokeWidth="3"/></g>)}
 <path d="M247 86v-32q0-13 13-13h17q13 0 16 13l6 32" fill="none" stroke="#314e42" strokeWidth="9"/><path d="M243 88h61v11h-64z" fill="#e4aa53" stroke="#ad7c39" strokeWidth="2"/>
 <path d="M222 218l118 0" stroke="#526c59" strokeWidth="6"/><circle cx="280" cy="218" r="5" fill="#dfaa51"/>
 <path d="M181 313h26v12h-28zM305 313h28v12h-25zM350 313h26v12h-23z" fill={danger?'#bd4e40':'#2b493d'}/>
 <g transform="translate(125 258)"><path d="M-24 24h45l-6 43h-33z" fill="#b97a50"/><path d="M0 25V-30" stroke="#51765b" strokeWidth="4"/><path d="M0 10q-42-2-29-29Q-4-22 0 10M0-9q38-8 27-31Q1-33 0-9M0-24q-29-4-17-27Q4-44 0-24" fill="#65876a"/></g>
 <g transform="translate(415 290)"><rect width="64" height="33" rx="5" fill="#ddb36e"/><path d="M20 0v-8h24v8" fill="none" stroke="#8a6d43" strokeWidth="4"/><path d="M0 11h64" stroke="#c3934f" strokeWidth="2"/><rect x="28" y="8" width="8" height="8" rx="2" fill="#f0d4a0"/></g>
 {hero&&<g><circle cx="407" cy="78" r="29" fill="#fff"/><path d="M394 77l9 9 17-19" fill="none" stroke="#52765b" strokeWidth="4" strokeLinecap="round"/><path d="M102 105h44M124 83v44" stroke="#bacab4" strokeWidth="2"/></g>}
 {scene===1&&<g><circle cx="190" cy="316" r="27" fill="none" stroke="#cb7545" strokeWidth="3" strokeDasharray="5 4"/><circle cx="235" cy="176" r="19" fill="none" stroke="#cb7545" strokeWidth="3" strokeDasharray="5 4"/><circle cx="272" cy="60" r="23" fill="none" stroke="#cb7545" strokeWidth="3" strokeDasharray="5 4"/></g>}
 {danger&&<g><path d="M167 326l49-1 12 11-64 1z" fill="#cb6650"/><circle cx="191" cy="318" r="26" stroke="#bc473b" strokeWidth="3" fill="none"/><path d="M396 119l49 14v183l-49-49z" fill="#cd8d74"/><path d="M465 170l18 18m0-18l-18 18" stroke="#bc473b" strokeWidth="5"/></g>}
 </svg>
}
