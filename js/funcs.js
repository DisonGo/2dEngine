function rotate(dot,angle){
    let xx = dot.x*cos(angle)-dot.y*sin(angle)
    dot.y = dot.y*cos(angle)+dot.x*sin(angle)
    dot.x = xx
}
function rotateFrom(beg,dot,angle){
    dot.x -= beg.x
    dot.y -= beg.y
    rotate(dot,angle)
    dot.x += beg.x
    dot.y += beg.y
}
function angleVector(angle)
{
  return Vector(cos(angle), sin(angle));
}
function AngleOfVector(V)
{
  let a = acos(V.x);
  if (V.y < 0) a = Math.PI*2 - a;
  return a;
}
function orient(a,b,c){
    return (a.x - c.x)*(b.y - c.y) - (a.y - c.y) * (b.x - c.x)
}