import { Component, OnChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnChanges {
  title = 'bowling-score-calculator';
  score = 0;
  frames = [];
  // game = new FormGroup({
  //   frame1a: new FormControl(''),
  //   frame1b: new FormControl(''),
  //   frame2a: new FormControl(''),
  //   frame2b: new FormControl(''),
  //   frame3a: new FormControl(''),
  //   frame3b: new FormControl(''),
  //   frame4a: new FormControl(''),
  //   frame4b: new FormControl(''),
  //   frame5a: new FormControl(''),
  //   frame5b: new FormControl(''),
  //   frame6a: new FormControl(''),
  //   frame6b: new FormControl(''),
  //   frame7a: new FormControl(''),
  //   frame7b: new FormControl(''),
  //   frame8a: new FormControl(''),
  //   frame8b: new FormControl(''),
  //   frame9a: new FormControl(''),
  //   frame9b: new FormControl(''),
  //   frame10: new FormControl(''),
  //   frame10b: new FormControl(''),
  //   frame10c: new FormControl('')
  // });
  game = new FormGroup({
    shot0: new FormControl(''),
    shot1: new FormControl(''),
    shot2: new FormControl(''),
    shot3: new FormControl(''),
    shot4: new FormControl(''),
    shot5: new FormControl(''),
    shot6: new FormControl(''),
    shot7: new FormControl(''),
    shot8: new FormControl(''),
    shot9: new FormControl(''),
    shot10: new FormControl(''),
    shot11: new FormControl(''),
    shot12: new FormControl(''),
    shot13: new FormControl(''),
    shot14: new FormControl(''),
    shot15: new FormControl(''),
    shot16: new FormControl(''),
    shot17: new FormControl(''),
    shot18: new FormControl(''),
    shot19: new FormControl(''),
    shot20: new FormControl('')
  });

  // game = new FormGroup({
  //   gameArr: new FormArray([
  //     new FormControl(''),
  //     new FormControl(''),
  //     new FormControl(''),
  //     new FormControl(''),
  //     new FormControl(''),
  //     new FormControl(''),
  //     new FormControl(''),
  //     new FormControl(''),
  //     new FormControl(''),
  //     new FormControl(''),
  //     new FormControl(''),
  //     new FormControl(''),
  //     new FormControl(''),
  //     new FormControl(''),
  //     new FormControl(''),
  //     new FormControl(''),
  //     new FormControl(''),
  //     new FormControl(''),
  //     new FormControl(''),
  //     new FormControl(''),
  //     new FormControl('')
  //   ])
  // });

  shot0 = new FormControl('');
  shot1 = new FormControl('');
  shot2 = new FormControl('');
  shot3 = new FormControl('');
  shot4 = new FormControl('');
  shot5 = new FormControl('');
  shot6 = new FormControl('');
  shot7 = new FormControl('');
  shot8 = new FormControl('');
  shot9 = new FormControl('');
  shot10 = new FormControl('');
  shot11 = new FormControl('');
  shot12 = new FormControl('');
  shot13 = new FormControl('');
  shot14 = new FormControl('');
  shot15 = new FormControl('');
  shot16 = new FormControl('');
  shot17 = new FormControl('');
  shot18 = new FormControl('');
  shot19 = new FormControl('');
  shot20 = new FormControl('');

  ngOnChanges = (event: any) => {
    //this._keyUp(event);
    // var shotName = 'shot'+shot;
    // console.log(this.game.controls[shotName].value);

    // Loops through everything
    Object.keys(this.game.controls).forEach(key => {
      var frame = this.game.controls[key].value;
      if(frame == "X") {

      }


    });
    
  }

  _keyUp(event: any, shotNumber: number) {

    var pattern;

    if(shotNumber %2 != 0 || shotNumber > 17) {
      pattern = /[0-9\/Xx]/y;
    } else {
      pattern = /[0-9]/y;
    }

    let inputChar = String.fromCharCode(event.key);
    if (!pattern.test(event.target.value)) {
      // invalid character, prevent input
      event.preventDefault();
      event.target.value = '';
    } else {
      this.calculate(shotNumber);
    }

  }


  calculate(shotNumber: number) {
    
    var shot;

    // first shot in frame and it is not the tenth frame
    if(shotNumber % 2 == 0 && shotNumber < 18) {

      const prevShot = this.game.controls['shot' + (shotNumber-1)].value;
      if (prevShot == "/") {
        const prevFrame = this.frames[((shotNumber/2)-1)];

      }



      // If it is a strike, unlock the first shot of the next frame
      // Otherwise, unlock the next shot

      // If the shot is not the first shot
        // Get the score of the previous frame
        // If there is no score
        // If the previous shot was a spare, 








      
      if(shot == "") {

      } else if(shot == "X") {

        this.calculate(shotNumber+2);
      } else {

      }

    // second shot in frame
    } else {

      if(shot == "X" || shot == "x") {

        // 

      } else if(shot == "/") {
  
      } else {
  
      }

    }


  }

  


}
