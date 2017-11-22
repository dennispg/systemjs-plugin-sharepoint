plugin-sharepoint
=================

A SharePoint 'Script-On-Demand' (SOD) loader plugin for SystemJS.

Installing
---

For installing with jspm, run `jspm install sharepoint`.

SP.SOD Concept
---

SharePoint provides a loading mechanism called 'Script-On-Demand' to load all of it's own JavaScript dependencies.
There are times in custom code when you must use this mechanism to ensure that specific SharePoint functionality has been loaded before your code can run.
There are various accepted methods to do this (such as SP.SOD.executeOrDelayUntilScriptLoaded), but they are generally clunky.

For SharePoint projects using system.js, this plugin allows you to load SOD dependencies using familiar syntax.

Basic Use
---

```javascript
import 'sp.js!sharepoint';
```