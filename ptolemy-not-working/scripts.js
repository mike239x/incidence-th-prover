scripts = {
  draw :
`drawtext(A+(A-F)/|A-F|*1.4-(.2,.2),"A",size->20);
drawtext(B+(B-F)/|B-F|*1.4-(.2,.2),"B",size->20);
drawtext(C+(C-F)/|C-F|*1.4-(.2,.2),"C",size->20);
drawtext(D+(D-F)/|D-F|*1.4-(.2,.2),"D",size->20);
if(mover()==C,
  r=C0.radius;
  d=|F,C|;
  pro=C*r/d+F*(d-r)/d;
  if(|pro,C|<0.25,C.xy=pro);
);

f(x):=format(x,2);

aa=|A,B|*|C,D|;
bb=|A,C|*|B,D|;
cc=|A,D|*|B,C|;

if(aa>=bb&aa>=cc,pa=6;pb=-1;pc=-8;s=aa-bb-cc);
if(bb>=aa&bb>=cc,pb=6;pa=-1;pc=-8;s=bb-aa-cc);
if(cc>=bb&cc>=aa,pc=6;pa=-1;pb=-8;s=cc-aa-bb);

drawrect(x,y,w,h):=(
 fillpoly([(x,y),(x+w,y),(x+w,y+h),(x,y+h)],color->(.6,.7,.9));
 connect([(x,y),(x+w,y),(x+w,y+h),(x,y+h),(x,y)],color->(0,0,0),size->2);
);
drawrect(-13,-12,50,6);

drawtext((pa,-7),"$|AB|$="+f(|A,B|),color->(0,0,0.7),size->17);
drawtext((pa,-8),"$|CD|$="+f(|C,D|),color->(0,0,0.7),size->17);
drawtext((pa,-9),"$|AB||CD|$="+f(|A,B|*|C,D|),color->(0,0,0.7),size->17);

drawtext((pb,-7),"$|AC|$="+f(|A,C|),color->(0.6,0,0),size->17);
drawtext((pb,-8),"$|BD|$="+f(|B,D|),color->(0.6,0,0),size->17);
drawtext((pb,-9),"$|AC||BD|$="+f(|A,C|*|B,D|),color->(0.6,0,0),size->17);

drawtext((pc,-7),"$|AD|$="+f(|A,D|),color->(0,0.5,0),size->17);
drawtext((pc,-8),"$|BC|$="+f(|B,C|),color->(0,0.5,0),size->17);
drawtext((pc,-9),"$|AD||BC|$="+f(|A,D|*|B,C|),color->(0,0.5,0),size->17);
drawtext((pc,-10.3),f(cc),color->(0,0.5,0),size->17);
drawtext((pb,-10.3),f(bb),color->(0.6,0,0),size->17);
drawtext((pa,-10.3),f(aa),color->(0,0,0.7),size->17);
drawtext((-4,-10.3),"+",color->(0,0,0),size->17);
drawtext((3,-10.3),if(s~=0,"=",if(s<0,">","<")),color->(0,0,0),size->17);`
}