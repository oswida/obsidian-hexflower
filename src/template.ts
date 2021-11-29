export const HexTemplate = `         {r}___{/r} 
     {r}___/ {/r}$8.{r}\\___{/r}
 ___/ $4.\\___/$13.\\___
/ $1.\\___/ $9.\\___/$17.\\
\\___/ $5.\\___/$14.\\___/
/ $2.\\___/$10.\\___/$18.\\
\\___/ $6.\\___/$15.\\___/ 
/ $3.\\___/$11.\\___/$19.\\
\\___/ $7.\\___/$16.\\___/
    \\{r}___{/r}/$12.\\{r}___{/r}/
        \\{r}___{/r}/`;

export const HexTemplateBase = () => {
	return HexTemplate.replaceAll("{r}", '<span class="fgred">').replaceAll(
		"{/r}",
		"</span>"
	);
};

export const DirectionsTemplate = `
<table class="hftab">
<tr><td>N</td><td>$n</td>
<tr><td>NE</td><td>$ne</td>
<tr><td>NW</td><td>$nw</td>
<tr><td>S</td><td>$s</td>
<tr><td>SE</td><td>$se</td>
<tr><td>SW</td><td>$sw</td>
<tr><td>IN</td><td>$in</td>
</table>
Roll: $roll
`;
