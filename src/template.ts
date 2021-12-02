export const NavigationHexTemplate = `
<div>
<div class="navblock" id="navinfo"></div>
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

export const ManualRollModalTemplate = `
<div>
<div>
Dice result: 
<input type="text" id="dice" />
</div>
<div id="buttons" class="hfmodalbtns"></div>
</div>
`;
