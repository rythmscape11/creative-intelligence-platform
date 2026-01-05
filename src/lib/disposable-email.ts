/**
 * List of common disposable email domains.
 * This list can be expanded or replaced with a more comprehensive library if needed.
 */
const DISPOSABLE_DOMAINS = new Set([
    'tempmail.com',
    'throwawaymail.com',
    'mailinator.com',
    'guerrillamail.com',
    'yopmail.com',
    '10minutemail.com',
    'sharklasers.com',
    'getnada.com',
    'dispostable.com',
    'temp-mail.org',
    'fake-email.com',
    'maildrop.cc',
    'trashmail.com',
    'tempmail.net',
    'tempmail.org',
    'tempmail.io',
    'tempmail.co',
    'tempmail.us',
    'tempmail.de',
    'tempmail.fr',
    'tempmail.pl',
    'tempmail.ru',
    'tempmail.cn',
    'tempmail.jp',
    'tempmail.kr',
    'tempmail.tw',
    'tempmail.vn',
    'tempmail.in',
    'tempmail.id',
    'tempmail.my',
    'tempmail.ph',
    'tempmail.sg',
    'tempmail.th',
    'tempmail.tr',
    'tempmail.ua',
    'tempmail.uk',
    'tempmail.us',
    'tempmail.ws',
    'tempmail.xyz',
    'tempmail.zone',
    'tempmail.biz',
    'tempmail.club',
    'tempmail.email',
    'tempmail.guru',
    'tempmail.info',
    'tempmail.live',
    'tempmail.me',
    'tempmail.mobi',
    'tempmail.name',
    'tempmail.online',
    'tempmail.press',
    'tempmail.pro',
    'tempmail.pub',
    'tempmail.site',
    'tempmail.space',
    'tempmail.store',
    'tempmail.tech',
    'tempmail.top',
    'tempmail.website',
    'tempmail.wiki',
    'tempmail.world',
    'tempmail.xyz',
]);

/**
 * Checks if an email address belongs to a disposable domain.
 * @param email The email address to check.
 * @returns True if the email is disposable, false otherwise.
 */
export function isDisposableEmail(email: string): boolean {
    if (!email || !email.includes('@')) {
        return false;
    }

    const domain = email.split('@')[1].toLowerCase();
    return DISPOSABLE_DOMAINS.has(domain);
}
