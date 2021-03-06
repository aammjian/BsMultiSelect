export function UpdateOptionsSelectedApiPlugin(pluginData){
    let {choices, optionPropertiesAspect} = pluginData;
    return {
        buildApi(api){
            // used in FormRestoreOnBackwardPlugin
            api.updateOptionsSelected = () => {
                choices.forLoop(
                    choice => {
                        let newIsSelected = optionPropertiesAspect.getSelected(choice.option);
                        if (newIsSelected != choice.isOptionSelected)
                        {
                            choice.isOptionSelected = newIsSelected;
                            choice.updateSelected();
                        }
                    }
                );
            }
        }
    }
}