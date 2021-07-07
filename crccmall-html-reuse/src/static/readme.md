# Math.js解决js计算精度问题 
## https://mathjs.org/docs/getting_started.html 
> > 0.1＋0.2 
> > math.format(math.chain(math.bignumber(0.1)).add(math.bignumber(0.2)).done());

> > 0.2-0.1 
> > math.format(math.chain(math.bignumber(0.2)).subtract(math.bignumber(0.1)).done());

> > 0.1*0.2 
> > math.format(math.chain(math.bignumber(0.1)).multiply(math.bignumber(0.2)).done());
 
> > 0.1/0.2 
> > math.format(math.chain(math.bignumber(0.1)).divide(math.bignumber(0.2)).done());