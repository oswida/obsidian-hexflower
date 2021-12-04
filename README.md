# Obsidian Hexflower Plugin

![Screenshot](src/assets/screenshot.png)

This is a widget simulating the behaviour of a Hexflower engine. A lot of information about Hexflower concept can be found at Goblin's Henchman site: <https://goblinshenchman.wordpress.com/category/hex-flower/>

## Hex positions

In the hexflower definition we do not use any of the official hexmap coordinate systems. It is not important because hex positions are used only to define their values. Thus hexes has been arbitrary numbered from 1 to 19 as it can be seen below.

<img src="src/assets/hf.svg" width="200" alt="hex numbers"/>

## Hexflower block format

Hexflower widget is inserted as a code block with `hexflower` keyword. You can specify text value for each hex and optional icon.
Text values for all 19 hexes are required and should be specified in order.
Icons are optional and as you can see in the example, they can be specified for a selected hex only. One of the great sources of icons could be <https://game-icons.net/>. Plugin accepts PNG, JPG and SVG images.

<pre>

```hexflower
name: Name of your hexflower
author: original author if applicable
source: and some link to the source
current: 8
navigation:
  - name: First navigation hex
    n: 12
    ne: 2,3
    se: 4,5
    s: 6
    sw: 8,9
    nw: 10
    in: 23
    roll: 2d6
  - name: Second navigation
    n: 12
    ne: 2,3
    se: 4,5
    s: 6
    sw: 8,9
    nw: 11,14
    in: null
    roll: 1d6+1d8
values:
  - Value at hex number 1
  - Value at hex number 2
  - Value at hex number 3
  - Value at hex number 4
  - Value at hex number 5
  - Value at hex number 6
  - Value at hex number 7
  - Value at hex number 8
  - Value at hex number 9
  - Value at hex number 10
  - Value at hex number 11
  - Value at hex number 12
  - Value at hex number 13
  - Value at hex number 14
  - Value at hex number 15
  - Value at hex number 16
  - Value at hex number 17
  - Value at hex number 18
  - Value at hex number 19
icons:
  1: Icon path for hex number 1 like "images/icon1.png"
  2: Icon path for hex number 2
  5: Icon path for hex number 5
  ...
```
</pre>

Alternatively, you can define the same hexflower inside a **note frontmatter section** and use it as a template. The only thing you need to do next is to define hexflower block with a `template` attribute. Please remember to include `name` attribute in your specification, because hexflower blocks are recognized and searched by their names (Thus means that names put inside a template text are replaced by the ones specified in a block).

<pre>
```hexflower
name: Hexflower from template
template: templates/weather block
```
</pre>

## TODO

- [ ] hexflower block validation
- [x] block templates
- [x] plugin settings with colors and elements visibility
- [x] hideable list of hex values below widget (for printing)
- [x] icons

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
