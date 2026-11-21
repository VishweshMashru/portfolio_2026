"""Export the portfolio assets from the original JapRes Blender project.

Run from the repo with Blender's bundled Python:
  blender -b --disable-autoexec /path/to/JapRes.blend --python scripts/export-japres.py

Writes public/japres.png and public/japres.glb. Never saves or overwrites the
source .blend. The still preserves the authored camera, lighting and fog.
The interactive export keeps the authored geometry/materials and omits the
Cycles-only fog volume and oversized studio backdrop. Its browser lighting
and camera are configured in app/JapResScene.tsx.
"""
from pathlib import Path
import bpy

public = Path(__file__).resolve().parent.parent / "public"
scene = bpy.context.scene
if not scene.camera:
    raise RuntimeError("JapRes needs its authored camera to render the preview")
scene.render.resolution_x = 1600
scene.render.resolution_y = 1200
scene.render.resolution_percentage = 100
scene.cycles.samples = 48
scene.cycles.use_denoising = True
scene.cycles.device = "CPU"
scene.render.image_settings.file_format = "PNG"
scene.render.filepath = str(public / "japres.png")
bpy.ops.render.render(write_still=True)

bpy.ops.object.select_all(action="DESELECT")
for obj in scene.objects:
    if obj.type in {"MESH", "FONT"} and obj.name not in {"fog", "Plane.005"} and not obj.hide_render:
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj
bpy.ops.object.convert(target="MESH")
bpy.ops.export_scene.gltf(
    filepath=str(public / "japres.glb"),
    export_format="GLB",
    use_selection=True,
    export_apply=True,
    export_materials="EXPORT",
    export_cameras=False,
    export_lights=False,
)
