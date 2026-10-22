"""Gói toàn bộ mã Three.js, CSS và ảnh tham chiếu vào MO-NGAY.html."""
from pathlib import Path
import base64
import json
import re


def module_url(text):
    return 'data:text/javascript;base64,' + base64.b64encode(text.encode()).decode()


def main():
    root=Path(__file__).resolve().parent
    refs={p.stem:'data:image/png;base64,'+base64.b64encode(p.read_bytes()).decode()
          for p in sorted((root/'references').glob('*.png'))}
    viewer=(root/'viewer.js').read_text(encoding='utf-8')
    viewer=viewer.replace("from './geometry.js'", "from 'mech-geometry'").replace("from './models.js'", "from 'mech-models'")
    viewer=viewer.replace('const REFERENCE_IMAGES={};','const REFERENCE_IMAGES='+json.dumps(refs)+';')
    modules={
        'three-core':(root/'vendor/three.core.js').read_text(encoding='utf-8'),
        'three':(root/'vendor/three.module.js').read_text(encoding='utf-8').replace("'./three.core.js'","'three-core'"),
        'three/addons/controls/OrbitControls.js':(root/'vendor/OrbitControls.js').read_text(encoding='utf-8'),
        'three/addons/exporters/GLTFExporter.js':(root/'vendor/GLTFExporter.js').read_text(encoding='utf-8'),
        'mech-geometry':(root/'geometry.js').read_text(encoding='utf-8').replace("from './vendor/three.module.js'","from 'three'"),
        'mech-models':(root/'models.js').read_text(encoding='utf-8').replace("from './geometry.js'","from 'mech-geometry'"),
        'mech-viewer':viewer,
    }
    imports={key:module_url(value) for key,value in modules.items()}
    html=(root/'index.html').read_text(encoding='utf-8')
    html=html.replace('<link rel="stylesheet" href="style.css">','<style>'+(root/'style.css').read_text(encoding='utf-8')+'</style>')
    html=re.sub(r'<script type="importmap">.*?</script>',lambda m:'<script type="importmap">'+json.dumps({'imports':imports})+'</script>',html,flags=re.S)
    html=html.replace("import('./viewer.js')","import('mech-viewer')")
    target=root/'MO-NGAY.html';target.write_text(html,encoding='utf-8')
    print('MO-NGAY.html:',target.stat().st_size,'bytes;',len(refs),'ảnh tham chiếu; 7 mô-đun JavaScript.')


if __name__=='__main__':
    main()
