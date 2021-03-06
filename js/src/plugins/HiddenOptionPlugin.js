export function HiddenOptionPlugin(pluginData){
    let {configuration, optionsAspect, options, createChoiceAspect, isChoiceSelectableAspect,
        choices, buildChoiceAspect, buildAndAttachChoiceAspect,
        countableChoicesListInsertAspect, countableChoicesList} = pluginData;

    countableChoicesListInsertAspect.countableChoicesListInsert = (choice, key) => {
        if ( !choice.isOptionHidden ){
            let choiceNext = choices.getNext(key, c=>!c.isOptionHidden );
            countableChoicesList.add(choice, choiceNext)
        }
    }

    let origBuildAndAttachChoice = buildAndAttachChoiceAspect.buildAndAttachChoice;
    buildAndAttachChoiceAspect.buildAndAttachChoice=(choice, getNextElement)=>{
        if (choice.isOptionHidden){ 
            buildHiddenChoice(choice);
        }
        else{ 
            origBuildAndAttachChoice(choice, getNextElement);
        }
    }

    var origIsSelectable = isChoiceSelectableAspect.isSelectable;
    isChoiceSelectableAspect.isSelectable = (choice) => origIsSelectable(choice) && !choice.isOptionHidden;

    let {getIsOptionHidden} = configuration;
    if (options) {
        if (!getIsOptionHidden)
            getIsOptionHidden = (option) => (option.hidden===undefined)?false:option.hidden;     
    } else {
        if (!getIsOptionHidden)
            getIsOptionHidden = (option) => option.hidden;     
    }
    
    var origСreateChoice = createChoiceAspect.createChoice;
    createChoiceAspect.createChoice = (option) => {
        let choice = origСreateChoice(option);
        choice.isOptionHidden = getIsOptionHidden(option);
        return choice;
    };

    return {
        buildApi(api){                                      
            api.updateOptionsHidden = () => updateOptionsHidden(optionsAspect, choices, countableChoicesList, getIsOptionHidden, buildChoiceAspect);
            api.updateOptionHidden  = (key) => updateOptionHidden(key, choices, countableChoicesList, getIsOptionHidden, buildChoiceAspect);
        }
    }
}
                      
function updateHidden(choice, getNextNonHidden, countableChoicesList, buildChoiceAspect) {
    if (choice.isOptionHidden) {
        countableChoicesList.remove(choice);
        choice.remove(); 
        buildHiddenChoice(choice);
    } else {
        let nextChoice = getNextNonHidden();
        countableChoicesList.add(choice, nextChoice);
        buildChoiceAspect.buildChoice(choice);
        choice.choiceElementAttach(nextChoice?.choiceElement);
    }
}

function buildHiddenChoice(choice){
    choice.updateSelected = () => void 0;
    choice.updateDisabled = () => void 0;
    
    choice.isChoiceElementAttached = false;
    choice.choiceElement = null;
    choice.choiceElementAttach = null;
    choice.setVisible = null; 
    choice.setHoverIn = null;
    choice.remove = null; 
    
    choice.dispose = () => { 
        choice.dispose = null;
    };
}

function updateOptionsHidden(optionsAspect, choices, countableChoicesList, getIsOptionHidden, buildChoiceAspect){
    let options = optionsAspect.getOptions();
    for(let i = 0; i<options.length; i++){
        updateOptionHidden(i, choices, countableChoicesList, getIsOptionHidden, buildChoiceAspect)
    }
}

function updateOptionHidden(key, choices, countableChoicesList, getIsOptionHidden, buildChoiceAspect){
    let choice = choices.get(key);
    let getNextNonHidden =  () => choices.getNext(key, c => !c.isOptionHidden );
    updateHiddenChoice(choice, getNextNonHidden, countableChoicesList, getIsOptionHidden, buildChoiceAspect)
}

function updateHiddenChoice(choice, getNextNonHidden, countableChoicesList, getIsOptionHidden, buildChoiceAspect){
    let newIsOptionHidden = getIsOptionHidden(choice.option);
    if (newIsOptionHidden != choice.isOptionHidden)
    {
        choice.isOptionHidden= newIsOptionHidden;
        updateHidden(choice, getNextNonHidden,  countableChoicesList, buildChoiceAspect)
    }
}