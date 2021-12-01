## Obsidian Hexflower Plugin

Hexflower concept explanation: <https://goblinshenchman.wordpress.com/category/hex-flower/>

## Hex positions
<pre>
         ___ 
     ___/ 8 \___
 ___/ 4 \___/13 \___
/ 1 \___/ 9 \___/17 \
\___/ 5 \___/14 \___/
/ 2 \___/10 \___/18 \
\___/ 6 \___/15 \___/
/ 3 \___/11 \___/19 \
\___/ 7 \___/16 \___/
    \___/12 \___/
        \___/
</pre>

## Hexflower block format

Navigation section below presents the list of possible navigation hexes, there can be more than one for a single hexflower.

<pre>
```hexflower
name: name of your hex
source: source of your hex
navigation:
  - desc: navigation hex description
    n: 12
    ne: 2,3
    se: 4,5
    s: 6
    sw: 8,9
    nw: 10,11
    in: 23
  - desc: navigation hex description
    n: 12
    ne: 2,3
    se: 4,5
    s: 6
    sw: 8,9
    nw: 10,11
    in: null
values:
  - Hex 1  value
  - Hex 2  value
  - Hex 3  value
  - Hex 4  value
  - Hex 5  value
  - Hex 6  value
  - Hex 7  value
  - Hex 8  value
  - Hex 9  value
  - Hex 10  value
  - Hex 11  value
  - Hex 12  value
  - Hex 13  value
  - Hex 14  value
  - Hex 15  value
  - Hex 16  value
  - Hex 17  value
  - Hex 18  value
  - Hex 19  value
roll: 2d6
current: 15
```
</pre>

### Releasing new releases

- Update your `manifest.json` with your new version number, such as `1.0.1`, and the minimum Obsidian version required for your latest release.
- Update your `versions.json` file with `"new-plugin-version": "minimum-obsidian-version"` so older versions of Obsidian can download an older version of your plugin that's compatible.
- Create new GitHub release using your new version number as the "Tag version". Use the exact version number, don't include a prefix `v`. See here for an example: <https://github.com/obsidianmd/obsidian-sample-plugin/releases>
- Upload the files `manifest.json`, `main.js`, `styles.css` as binary attachments. Note: The manifest.json file must be in two places, first the root path of your repository and also in the release.
- Publish the release.

### Adding your plugin to the community plugin list

- Publish an initial version.
- Make sure you have a `README.md` file in the root of your repo.
- Make a pull request at <https://github.com/obsidianmd/obsidian-releases> to add your plugin.

### How to use

- Clone this repo.
- `npm i` or `yarn` to install dependencies
- `npm run dev` to start compilation in watch mode.

### Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/your-plugin-id/`.

### Improve code quality with eslint (optional)

- [ESLint](https://eslint.org/) is a tool that analyzes your code to quickly find problems. You can run ESLint against your plugin to find common bugs and ways to improve your code.
- To use eslint with this project, make sure to install eslint from terminal:
  - `npm install -g eslint`
- To use eslint to analyze this project use this command:
  - `eslint main.ts`
  - eslint will then create a report with suggestions for code improvement by file and line number.
- If your source code is in a folder, such as `src`, you can use eslint with this command to analyze all files in that folder:
  - `eslint .\src\`

### API Documentation

See <https://github.com/obsidianmd/obsidian-api>
