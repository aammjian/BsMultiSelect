import $ from 'jquery'
import Popper from 'popper.js'

import {addToJQueryPrototype} from './AddToJQueryPrototype'
import {BsMultiSelect} from './BsMultiSelect';
import {initiateDefaults, mergeDefaults} from './PluginManager';

import {css} from './BsCss'

import {LabelPlugin} from './plugins/LabelPlugin';
import {RtlPlugin} from './plugins/RtlPlugin';
import {FormResetPlugin} from './plugins/FormResetPlugin';
import {ValidationApiPlugin} from './plugins/ValidationApiPlugin';
import {BsAppearancePlugin} from './plugins/BsAppearancePlugin';
import {HiddenOptionPlugin} from './plugins/HiddenOptionPlugin';
import {CssPatchPlugin} from './plugins/CssPatchPlugin';
import {PlaceholderPlugin} from './plugins/PlaceholderPlugin';
import {JQueryMethodsPlugin} from './plugins/JQueryMethodsPlugin';
import {OptionsApiPlugin} from './plugins/OptionsApiPlugin';
import {FormRestoreOnBackwardPlugin} from './plugins/FormRestoreOnBackwardPlugin';
import {SelectElementPlugin} from './plugins/SelectElementPlugin';
import {SelectAllApiPlugin} from './plugins/SelectAllApiPlugin';
import {UpdateOptionsSelectedApiPlugin} from './plugins/UpdateOptionsSelectedApiPlugin'
import {DisabledOptionApiPlugin} from './plugins/DisabledOptionApiPlugin'

import {adjustLegacySettings} from './BsMultiSelectDepricatedParameters'

import {createCss} from './ToolsStyling';
import {extendIfUndefined, composeSync} from './ToolsJs';

import  {EventBinder} from './ToolsDom';
import  {addStyling, toggleStyling} from './ToolsStyling';

(
    (window, $, Popper) => {
        const defaults = {containerClass: "dashboardcode-bsmultiselect", css: css}
        let defaultPlugins = [CssPatchPlugin, SelectElementPlugin, LabelPlugin, HiddenOptionPlugin, ValidationApiPlugin, 
        BsAppearancePlugin, FormResetPlugin, RtlPlugin, PlaceholderPlugin , OptionsApiPlugin, SelectAllApiPlugin,
        JQueryMethodsPlugin, UpdateOptionsSelectedApiPlugin, FormRestoreOnBackwardPlugin,  DisabledOptionApiPlugin];
        let createBsMultiSelect = (element, settings, removeInstanceData) => { 
            let trigger = (e, eventName) => $(e).trigger(eventName);
            let environment = {trigger, window, Popper}
            environment.plugins = defaultPlugins;

            let configuration = {};
            let buildConfiguration;
            if (settings instanceof Function) {
                buildConfiguration = settings;
                settings = null;
            } else {
                buildConfiguration = settings?.buildConfiguration;
            }

            if (settings)
                adjustLegacySettings(settings);
            
            configuration.css = createCss(defaults.css, settings?.css);
            mergeDefaults(defaultPlugins, configuration, defaults, settings);

            extendIfUndefined(configuration, settings);
            extendIfUndefined(configuration, defaults);
        
            let onInit = buildConfiguration?.(element, configuration);

            let multiSelect = BsMultiSelect(element, environment, configuration, onInit);
            multiSelect.dispose = composeSync(multiSelect.dispose, removeInstanceData);
            return multiSelect;
        }
        let prototypable = addToJQueryPrototype('BsMultiSelect', createBsMultiSelect, $);

        initiateDefaults(defaultPlugins, defaults);
        prototypable.defaults = defaults;

        prototypable.tools = {EventBinder, addStyling, toggleStyling}
    }
)(window, $, Popper)

