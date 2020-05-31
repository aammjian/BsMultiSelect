import {ListFacade /*, sync, composeSync*/} from './ToolsJs'
//import {addStyling} from './ToolsStyling';

export function ChoicesGetNextAspect(getHead, getNext){
    return {
        getHead, 
        getNext
    }
}

export function ChoicesEnumerableAspect(choicesGetNextAspect){
    return {
        forEach(f){
            let choice =  choicesGetNextAspect.getHead(); // this.choices.getHead()
            while(choice){
                forEach( (choice)=>{
                    f(choice);
                    choice = choicesGetNextAspect.getNext(choice);
                });
            }
        }
    }
}

export function FilterListAspect(choicesGetNextAspect, choicesEnumerableAspect) {
    let filterListFacade = ListFacade(
        (choice)=>choice.filteredPrev, 
        (choice, v)=>choice.filteredPrev=v, 
        (choice)=>choice.filteredNext, 
        (choice, v)=>choice.filteredNext=v
    );

    let composeFilterPredicate = (text) => 
            (choice) => !choice.isOptionSelected  && !choice.isOptionDisabled  && choice.searchText.indexOf(text) >= 0     

    return {
        addFilterFacade(choice){ // redefined in HidenOptionPulgin
            filterListFacade.add(choice);
        },
        insertFilterFacade(choice){ // redefined in HidenOptionPulgin
            let choiceNonhiddenBefore = choicesGetNextAspect.getNext(choice);
            filterListFacade.add(choice, choiceNonhiddenBefore);
        },
        navigate(down, choice /* hoveredChoice */){ 
            if (down) {
                return choice?choice.filteredNext: filterListFacade.getHead();
            } else {
                return choice?choice.filteredPrev: filterListFacade.getTail();
            }
        },        
        
        processEmptyInput(){ // redefined in PlaceholderPulgin
            filterListFacade.reset();
            choicesEnumerableAspect.forEach( (choice)=>{
                choice.filteredPrev = choice.filteredNext = null;
                filterListFacade.add(choice);
                choice.setVisible(true);
            });
        },
        setFilter(text){ 
            let getFilterIn = composeFilterPredicate(text)
            filterListFacade.reset();
            choicesEnumerableAspect.forEach( (choice)=>{
                choice.filteredPrev = choice.filteredNext = null;
                var v = getFilterIn(choice);
                if (v)
                    filterListFacade.add(choice);
                choice.setVisible(v);
            });
        },

        getCount(){
            return filterListFacade.getCount();
        },
        getHead(){
            return filterListFacade.getHead();
        },
        reset(){
            return filterListFacade.reset();
        },
        remove(c){
            filterListFacade.remove(c);
        },
        add(e, next){
            filterListFacade.add(e, next);
        },
        remove(e){
            filterListFacade.remove(e);
        }
    }
}