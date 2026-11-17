import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import ts from 'typescript'
import * as jsxRuntime from 'react/jsx-runtime'

// Exercise the real header's blur handlers. Safari can blur to null during
// a touch press before the anchor receives its click.
let stateIndex=0
const updates=[]
const dependencies={
 react:{useCallback:fn=>fn,useEffect:()=>{},useRef:()=>({current:null}),useState:()=>{
  const index=stateIndex++
  return [index===1, value=>updates.push({index,value})]
 }},
 'react/jsx-runtime':jsxRuntime,
 '@/components/layout/Container':{Container:()=>null},
 '@/components/layout/Logo':{Logo:()=>null},
 '@/components/routing/SiteLink':{default:()=>null},
 '@/lib/site':{site:{}},
 '@/lib/v3-publication':{navigationForPath:()=>[{id:'product',sections:[],feature:{item:{href:'/product'}}}],navigationShortcuts:()=>[]},
 './Arrow':{Arrow:()=>null},
 './SiteHeader.module.css':{default:{}},
}
const module={exports:{}}
const code=ts.transpileModule(readFileSync('components/v3/SiteHeader.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText
new Function('require','module','exports',code)(name=>{assert(Object.hasOwn(dependencies,name),name);return dependencies[name]},module,module.exports)
const header=module.exports.SiteHeader({pathname:'/',commentary:false})
const inside={},outside={}
const blur=relatedTarget=>({relatedTarget,currentTarget:{contains:node=>node===inside}})
header.props.onBlur(blur(null));header.props.onBlur(blur(inside))
assert.equal(updates.length,0,'Touch blur and focus inside the drawer must preserve links until click')
header.props.onBlur(blur(outside))
assert.deepEqual(updates,[{index:1,value:false}],'Keyboard focus leaving the header dismisses the drawer')
console.log('Header touch blur preserves navigation; keyboard focus exit closes drawer.')
