declare module '@mailchimp/mailchimp_marketing' {
  interface MailchimpConfig {
    apiKey: string;
    server: string;
  }

  interface MailchimpClient {
    setConfig(config: MailchimpConfig): void;
    ping: {
      get(): Promise<any>;
    };
    lists: {
      getAllLists(params?: any): Promise<any>;
      setListMember(listId: string, subscriberHash: string, body: any): Promise<any>;
      updateListMemberTags(listId: string, subscriberHash: string, body: any): Promise<any>;
    };
    batches: {
      start(body: any): Promise<any>;
    };
    campaigns: {
      create(body: any): Promise<any>;
      setContent(campaignId: string, body: any): Promise<any>;
      send(campaignId: string): Promise<any>;
    };
  }

  const mailchimp: MailchimpClient;
  export default mailchimp;
}

