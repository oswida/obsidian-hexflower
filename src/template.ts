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

export const HexTemplateBig = `  ____
 /    \\
/  $IN \\
\\      /
 \\____/
`;

export const HexTemplateSmall = ` ___
/   \\
\\___/
`;
export const NavigationHexTemplate = `
<div>
<table class="hftab-nb nopad" id="bkgtable" style="margin-right: 20px">
<tr><td class="centered nopad navtext" colspan="3" style="vertical-align:bottom;">{N}</td></tr>
<tr>
<td style="vertical-align:middle">
<table class="hftab-nb nopad">
<tr><td class="centered nopad navtext" style="padding-top:20px;">{NW}</td></tr>
<tr><td class="centered navtext" class="nopad navtext" style="padding-top:30px;">{SW}</td></tr>
</table>
</td>
<td class="centered navtext"  id="inside">{IN}</td>
<td style="vertical-align:middle">
<table class="hftab-nb nopad">
<tr><td class="centered nopad navtext" style="padding-top:20px;">{NE}</td></tr>
<tr><td class="centered nopad navtext" style="padding-top:30px;">{SE}</td></tr>
</table>
</td>
</tr>
<tr><td colspan="3" class="centered nopad navtext" style="vertical-align:top">{S}</td></tr>
</table>
<div class="hicons centered" id="navicons"></div>
<div class="centered" id="navdesc" ></div>
</div>
`;

export const ResetModalTemplate = `
<div>
<div>
Starting hex number: 
<select id="hexvalue">
<option>1</option><option>2</option><option>3</option><option>4</option><option>5</option>
<option>6</option><option>7</option><option>8</option><option>9</option><option selected>10</option>
<option>11</option><option>12</option><option>13</option><option>14</option><option>15</option>
<option>16</option><option>17</option><option>18</option><option>19</option>
</select>
</div>
<div id="buttons" class="hfmodalbtns"></div>
</div>
`;
