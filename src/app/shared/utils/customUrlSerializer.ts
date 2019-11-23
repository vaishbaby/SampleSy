import {DefaultUrlSerializer, UrlSerializer, UrlTree} from '@angular/router';

export class CustomUrlSerializer extends DefaultUrlSerializer implements UrlSerializer  {
  serialize(tree: UrlTree): string {
    return super.serialize(tree).replace(/\(|\)|\w+-\w+:/g, '');
  }
}