import {createCss, extendCss} from '../ToolsStyling';
import {isBoolean} from '../ToolsJs';
import {cssPatch} from '../BsCss'

export function CssPatchPlugin(){
}

CssPatchPlugin.initiateDefaults = (defaults)=>{
    defaults.useCssPatch = true;
    defaults.cssPatch = cssPatch;
}

CssPatchPlugin.mergeDefaults = (configuration, defaults, settings)=>{
    let cssPatch = settings?.cssPatch;
    if (isBoolean(cssPatch))
        throw new Error("BsMultiSelect: 'cssPatch' was used instead of 'useCssPatch'") // often type of error
    configuration.cssPatch = createCss(defaults.cssPatch, cssPatch); // replace classes, merge styles
}

CssPatchPlugin.plugOnConfiguration = (configurationPluginData) =>{
    let {configuration} = configurationPluginData;
    if (configuration.useCssPatch)
        extendCss(configuration.css, configuration.cssPatch); 
}