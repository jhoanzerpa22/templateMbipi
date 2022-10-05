import {Injectable} from '@angular/core';

@Injectable()
export class LoadMaskService {
    public isLoading: boolean;

    constructor () {}
    
    	show() {
		    this.isLoading = true;
		}

		hide(){
		    this.isLoading = false;
		}

}