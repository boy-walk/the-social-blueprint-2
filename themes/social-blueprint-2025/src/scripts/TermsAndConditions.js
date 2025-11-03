import React from 'react';

export function TermsAndConditions() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 space-y-10">
      <header className="text-center space-y-4">
        <h1 className="Blueprint-headline-large-emphasized">Terms and Conditions</h1>
        <p className="Blueprint-body-large text-schemesOnSurfaceVariant">
          Welcome to The Social Blueprint website. By using this website, you agree to the following terms and
          conditions. Please read them carefully.
        </p>
      </header>

      <section className="space-y-6">
        {[
          {
            title: '1. About Us',
            body: `The Social Blueprint is a trusted, apolitical digital hub built to support and showcase the Melbourne Jewish
            community. We provide access to events, interviews, organisations, resources, and initiatives relevant to Jewish life,
            advocacy, wellbeing, and culture.`,
          },
          {
            title: '2. Using This Website',
            body: (
              <>
                <p>
                  You agree to use this website in a lawful, respectful, and responsible manner. That means you must not:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Upload or share harmful, misleading, or offensive content</li>
                  <li>Impersonate others or misrepresent your association with any organisation</li>
                  <li>Attempt to interfere with the functionality or security of the site</li>
                </ul>
                <p>We reserve the right to restrict or remove access if we believe someone is misusing the platform.</p>
              </>
            ),
          },
          {
            title: '3. Content and Listings',
            body: (
              <>
                <p>We aim to keep the information on this website accurate and up to date. However:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>We do not guarantee the completeness, accuracy, or reliability of listings or user-submitted content</li>
                  <li>We do not endorse or take responsibility for the views, work, or conduct of any individual or organisation listed on this site</li>
                </ul>
                <p>If you engage with a listed organisation or person, it’s up to you to make your own assessment. We take no responsibility for the outcomes of those interactions.</p>
              </>
            ),
          },
          {
            title: '4. Intellectual Property',
            body: (
              <>
                <p>We aim to keep the information on this website accurate and up to date. However:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>We do not guarantee the completeness, accuracy, or reliability of listings or user-submitted content</li>
                  <li>We do not endorse or take responsibility for the views, work, or conduct of any individual or organisation listed on this site</li>
                </ul>
                <p>If you engage with a listed organisation or person, it’s up to you to make your own assessment. We take no responsibility for the outcomes of those interactions.</p>
              </>
            ),
          },
          {
            title: '5. Privacy',
            body: (
              <>
                <p>
                  We care about your privacy. Any personal information you provide through forms or emails will be handled in line with our <a href="/privacy" className="underline">Privacy Policy</a>.
                </p>
                <p>
                  We do not sell or share your data with third parties unless required by law.
                </p>
                <p>
                  We may use cookies to improve your experience. By using the site, you consent to our use of cookies.
                </p>
              </>
            ),
          },
          {
            title: '6. External Links',
            body: (
              <p>
                Our site may link to external websites for convenience or reference. These sites are not under our control.
                We are not responsible for their content, security, or privacy practices.
              </p>
            ),
          },
          {
            title: '7. Liability',
            body: (
              <>
                <p>To the fullest extent allowed by law:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>We are not liable for any direct or indirect loss resulting from your use of this site</li>
                  <li>We do not guarantee uninterrupted or error-free operation of the website</li>
                  <li>
                    We are not liable for any loss or damage caused by viruses or other harmful material arising from
                    use of our site or third-party links
                  </li>
                </ul>
                <p>
                  Nothing in this clause excludes consumer guarantees under Australian Consumer Law that cannot be excluded.
                </p>
              </>
            ),
          },
          {
            title: '8. Updates to These Terms',
            body: (
              <p>
                We may update these Terms and Conditions from time to time. If we make changes, we’ll update the effective date at the top of this page.
                Continued use of the site means you accept the revised terms.
              </p>
            ),
          },
          {
            title: '9. Contact',
            body: (
              <p>
                If you have questions about these terms or need clarification, please get in touch at [insert email address].
              </p>
            ),
          },
          {
            title: '10. Governing Law',
            body: (
              <p>
                These Terms are governed by the laws of Victoria, Australia. Any disputes will be handled in the courts of that jurisdiction.
              </p>
            ),
          },
        ].map(({ title, body }) => (
          <section key={title} className="space-y-2">
            <h2 className="Blueprint-title-large-emphasized">{title}</h2>
            <div className="Blueprint-body-medium text-schemesOnSurfaceVariant">{body}</div>
          </section>
        ))}
      </section>
    </main>
  );
}
