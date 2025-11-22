# Avatar GLB Setup

The app currently uses a fallback sphere. To use a Ready Player Me avatar:

## Steps

1. **Create Avatar:**
   - Visit https://readyplayer.me/
   - Design and customize your avatar
   - Click "Done" when finished

2. **Download GLB:**
   - After creating the avatar, you'll get a URL
   - Open that URL in your browser to download the GLB file
   - OR use the Ready Player Me API/export feature

3. **Place in Project:**
   ```bash
   # Move your downloaded avatar.glb to:
   mv ~/Downloads/avatar.glb /Users/jesse/JesseRod329.github.io/yes-jarvis/apps/web/public/avatar.glb
   ```

4. **Note on Lip-sync:**
   - For proper lip-sync, the GLB needs ARKit/Oculus blendshapes (morph targets)
   - When exporting from Ready Player Me, ensure you export with facial blendshapes enabled
   - The app will automatically detect and use morph targets if available

## Current Status

The app will work with a fallback sphere if no `avatar.glb` is found. The sphere will display but won't have lip-sync capabilities.


