import { Pipe, PipeTransform } from '@angular/core';
import { EmailChain } from './qa.service';

@Pipe({
    name: 'search'
})
export class SearchPipe implements PipeTransform {
    public transform(echains: EmailChain[], searchQuery: string) {

        if (searchQuery === '') {
            return echains;
        }
        return echains.filter(emails => {
            for (const email of emails) {
                if (email.subject.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1 || email.body.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1) {
                    return true;
                }
            }
            return false;
        });

    }
}
