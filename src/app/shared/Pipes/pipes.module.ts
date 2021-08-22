import { NgModule } from '@angular/core';
import { ConverterDecimalToHourPipe } from './converter-decimal-to-hour.pipe';


const PIPES: any[] = [
    ConverterDecimalToHourPipe
];

@NgModule({
    imports: [],
    declarations: [ConverterDecimalToHourPipe],
    exports: [ConverterDecimalToHourPipe]
})  
export class PipesModule {
    static forRoot() {
        return {
            ngModule: PipesModule,
            providers: [],
        };
     }
}
