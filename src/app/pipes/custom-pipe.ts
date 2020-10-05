import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customPreview'
})
export class CustomPreviewPipe implements PipeTransform {

  transform(value: any): any[] {
    return value !== null ? value.toString().split('') : [];
  }

}
