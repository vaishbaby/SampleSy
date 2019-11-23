import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

export interface Attachment {
    name: string;
    link: string;
    size: string;
}

export interface Email {
    id: string;
    from: string;
    to: string[];
    subject: string;
    attachment: Attachment[];
    date: Date;
    body: string;
}

export type EmailChain = Email[];

@Injectable()
export class QaService {
    constructor(private http: HttpClient) { }
    public getEmailList(): Observable<EmailChain[]> {
        // const dummyAttachment: Attachment[] = [
        //     {
        //         name: 'testAttach-1',
        //         link: 'a.com',
        //         size: '124 kb'
        //     },
        //     {
        //         name: 'testAttach-2',
        //         link: 'b.com',
        //         size: '125 kb'
        //     },
        //     {
        //         name: 'testAttach-3',
        //         link: 'a.com',
        //         size: '126 kb'
        //     }
        // ];
        // const dummyEmail1: Email = {
        //     id: '1',
        //     from: 'Naveen Goyal',
        //     to: ['Amit Kale', 'Vishal Gadekar'],
        //     subj: 'Annotation - Focus on the screen /workflow -1',
        //     attachment: dummyAttachment,
        //     date: new Date(),
        //     body: `<p>Hi Amit,</p>
        //     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        //     Neque egestas congue quisque egestas diam.<br/> <br/> Nibh sit amet commodo nulla facilisi nullam vehicula. Egestas fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate. Suscipit tellus mauris a diam maecenas sed enim ut sem. Amet cursus sit amet dictum sit amet justo. Amet porttitor eget dolor morbi non arcu risus. Eget arcu dictum varius duis. Nibh cras pulvinar mattis nunc sed blandit libero. Ultrices sagittis orci a scelerisque purus semper. Nunc faucibus a pellentesque sit amet porttitor eget. Nulla aliquet enim tortor at auctor urna nunc id cursus. Mi bibendum neque egestas congue quisque egestas diam.<br/><br/>
        //     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        //     Neque egestas congue quisque egestas diam.<br/> <br/> Nibh sit amet commodo nulla facilisi nullam vehicula. Egestas fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate. Suscipit tellus mauris a diam maecenas sed enim ut sem. Amet cursus sit amet dictum sit amet justo. Amet porttitor eget dolor morbi non arcu risus. Eget arcu dictum varius duis. Nibh cras pulvinar mattis nunc sed blandit libero. Ultrices sagittis orci a scelerisque purus semper. Nunc faucibus a pellentesque sit amet porttitor eget. Nulla aliquet enim tortor at auctor urna nunc id cursus. Mi bibendum neque egestas congue quisque egestas diam.<br/><br/> Kind regards,<br/> Naveen Goyal<br/>`        };

        // const dummyEmail2: Email = {
        //     id: '2',
        //     from: 'Amit Kale',
        //     to: ['Vishal Gadekar', 'Naveen Goyal'],
        //     subj: 'Annotation - Focus on the screen /workflow -2',
        //     attachment: null,
        //     date: new Date(),
        //     body: `<p>Hi Vishal,</p>
        //     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        //     Neque egestas congue quisque egestas diam. Nibh sit amet commodo nulla facilisi nullam vehicula. Egestas fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate. Suscipit tellus mauris a diam maecenas sed enim ut sem. Amet cursus sit amet dictum sit amet justo. Amet porttitor eget dolor morbi non arcu risus. Eget arcu dictum varius duis. Nibh cras pulvinar mattis nunc sed blandit libero. Ultrices sagittis orci a scelerisque purus semper. Nunc faucibus a pellentesque sit amet porttitor eget. Nulla aliquet enim tortor at auctor urna nunc id cursus. Mi bibendum neque egestas congue quisque egestas diam.<br/><br/> Kind regards,<br/> Amit`        };

        // const dummyEmail3: Email = {
        //     id: '3',
        //     from: 'Vishal Gadekar',
        //     to: [ 'Naveen Goyal'],
        //     subj: 'Annotation - Testing Search',
        //     attachment: null,
        //     date: new Date(),
        //     body: `<p>Hi Naveen,</p>
        //         Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        //         Neque egestas congue quisque egestas diam. Nibh sit amet commodo nulla facilisi nullam vehicula. Egestas fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate. Suscipit tellus mauris a diam maecenas sed enim ut sem. Amet cursus sit amet dictum sit amet justo. Amet porttitor eget dolor morbi non arcu risus. Eget arcu dictum varius duis. Nibh cras pulvinar mattis nunc sed blandit libero. Ultrices sagittis orci a scelerisque purus semper. Nunc faucibus a pellentesque sit amet porttitor eget. Nulla aliquet enim tortor at auctor urna nunc id cursus. Mi bibendum neque egestas congue quisque egestas diam.<br/><br/> Kind regards,<br/> Vishal`        };
        
        //  const dummyEmail4: Email = {
        //     id: '4',
        //     from: 'Pradeep Shimpale',
        //     to: [ 'Naveen Goyal'],
        //     subj: 'Annotation - Testing Search',
        //     attachment: null,
        //     date: new Date(),
        //     body: `<p>Hi Naveen,</p>
        //         Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        //         Neque egestas congue quisque egestas diam. Nibh sit amet commodo nulla facilisi nullam vehicula. Egestas fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate. Suscipit tellus mauris a diam maecenas sed enim ut sem. Amet cursus sit amet dictum sit amet justo. Amet porttitor eget dolor morbi non arcu risus. Eget arcu dictum varius duis. Nibh cras pulvinar mattis nunc sed blandit libero. Ultrices sagittis orci a scelerisque purus semper. Nunc faucibus a pellentesque sit amet porttitor eget. Nulla aliquet enim tortor at auctor urna nunc id cursus. Mi bibendum neque egestas congue quisque egestas diam.<br/><br/> Kind regards,<br/> Vishal`        };
        // const dummyEmailChain1: EmailChain = [dummyEmail2, dummyEmail3, dummyEmail1];
        // const dummyEmailChain2: EmailChain = [dummyEmail2];
        // const dummyEmailChain3: EmailChain = [dummyEmail1, dummyEmail2];
        // const dummyEmailChain4: EmailChain = [dummyEmail3, dummyEmail2];
        // const dummyEmailChain5: EmailChain = [dummyEmail4];

        // return of([dummyEmailChain1, dummyEmailChain2, dummyEmailChain3, dummyEmailChain4, dummyEmailChain5 ]);
    //    return this.http.get("http://localhost:8080/docketManagement/email/searchemail?key='Hi'");

      return of([]);
    }

    public searchEmails(key: any): Observable<EmailChain[]> {
        return this.http.get<EmailChain[]>("searchemail",{
            "params": {
                "key": key
            }
        });
    } 

    public hasAttachment(eChain: EmailChain) {
        return eChain.find(ems => ems.attachment && ems.attachment.length > 0);
    }
}
