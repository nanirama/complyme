export const env = {
    // Site URL configuration
    URL: '',
    VERCEL_URL: '',
    
    // Google Sheets API configuration
    GOOGLE_PROJECT_ID: 'cm-posts',
    GOOGLE_CLIENT_ID: '102651890570600443846',
    GOOGLE_CLIENT_EMAIL: 'cm-posts@cm-posts.iam.gserviceaccount.com',
    GOOGLE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDFwOzhlanjtfkj\nzV9wsne8h/4Msm62Vfvb6MWy1MM4dlWna1WZNeKhbBk6gRf+tPZG9AjvgUGWZZSF\nhYzpEsyMlrF1YeJduJMTgCawI11zh+99UoX+7O/IrzfLimNtKysumLWtfoP5OTPS\n7Jk3FiC3BUbOLhGp5efSc0aPgwU/N3flvHsL32UYhdDzLfUrCnyWYCquq7XJ4duN\nVdn7dVbp7NORsWbN84CRZZ+p8Te2tARAKrKATcsa+ovYDcbcHanxTJ1qtW3pKZnv\natbKAUO7/D61t0RSoaUbEiNRvmN/EwtZM4fIpfeMjx/wdmCg7s5Fcx/xMEPtQUFw\nh2bjLRfXAgMBAAECggEANwcGw4UOd79Q2v4Qgz8eI3eiIW1bcmB9y4U70hXzVthS\n4Fn1QUNl025NnOKER0uaxkas39yTYCLXD8qIWejxw2NBcTzyLQsp3gDIgzXsELRw\nV2qpv7S1yp27RGe3YA7lnrs+vs7YMXcR7S0KO3JsWxFcUQ4vuxuvBPgv18ppINw0\nxxzvBpPMTLUoRo2otCkggLbmWjn3GhF5NOTHSWpY2sFb3KxxdtjLEfb38cjrBd7e\n4Vl76MrbiaLJwoaEZDBVwzn4gv+JnYjynY3MFv4yen2LPTRkH09C6tl9UvrSUu29\n1C9cwmSE5bWe6VBmQjcLkb7nh/Pm9JztDnSTSdixFQKBgQDisxbaCPsHSFN0GrVC\nIjsklLseGDCBQ5l+9Zq7lAJnycVqP/altgORtOALWtf2RGfcBtxOs16foP7fUXuz\nnb2HVTuzCn8Nd5w9fpTYfymgaO3WlQi5twWqpajryq5Km7mHLnUtjQvOkQbUtVbY\nm3HlRttWG2Tf+3pyUZN9j6CepQKBgQDfUBaYlqYx4ceXb7OQLJLU5VFed+qjtddz\ns2SAzJioJi4geEB9gvUpzWxyKmC0IY+I8rZNBwE7WKcgNrEV9s7IG3EOlGd450Pf\nBvbVK+8jO+v0bopgIju2CXRqp1Og8+nQZKWQAgsaoC5og8Hex8Q9N5Rk9/o4w5ZB\nzBX94sMvywKBgGFCfnpawgA02oEEeGGAOCmQmdrme+DpdLBQhOsXLBUFLupPuO0N\ncuiPVlPozKC+ZmSymNA3ClCoDNEYr163PToTqkI9LZdEisajSQ69N8m3WtrmI9Ex\noX++BQPsd+xQdT93AhTh33/nHqwhhLn3rty0EqQVqqihxr3HG+URutJ1AoGAKFEV\nQ0cviiHxHu4TxRvHBpjAMAYGXrgdxc3Ff1tw1CrQeRw8yGw0Ru/HfHUaMGs+tsLb\nFt0E4+oFglNddVGx037g0nkIlVNrdYCUX7gm3H2dA+xRHzoO/baHRhofhxeCRxVk\nrrMvvgbdWhEvl0EJtOOr7u62RjlJj2eBMO0XwDECgYBQTfA4MU8DJITEDrZkk9hb\nvPXNX57R0aSTgOT6SlP5gpFa0MsYhtYdm1/b01RKJ0wIqJ49ChsKQoKvFkcHKlQS\n6E4XBNyruJOO37N0rx9KfE2UV6iWJfc7V+VXWS1FWpWFNpce2Se26xPDohN3AV1k\ntg0SWWdaYWZyTeOeiQgWog==\n-----END PRIVATE KEY-----\n',
    SPREADSHEET_ID: '1z-CxvMRhgi1qlyR2zLxRW1f_Ymr1iaGhEiMZV5yml94',
    
    // BREVO Email configuration
    BREVO_API_KEY: `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`,
    BREVO_REGISTRATION_TEMPLATE_ID: '1',
    
    // Supabase configuration
    SUPABASE_URL: 'https://bihdpfidcfvnldhkuedz.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpaGRwZmlkY2Z2bmxkaGt1ZWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NTcwMTYsImV4cCI6MjA2MDEzMzAxNn0.nAVat-CSfR6rJwgMucQJhDSl1aKxqPbtqIOGhA3xaKE',
  };

export interface SocialLink {
  name: string;
  url: string;
}

export interface MenuItem {
  name: string;
  slug: string;
}

export interface FooterMenuSection {
  title: string;
  items: MenuItem[];
}

export interface SiteConfig {
  // General Site Metadata
  title: string;
  siteUrl: string;
  name: string;
  description: string;
  address: string;
  email: string;
  phone: string;

  // Site Social Media Links
  social: SocialLink[];

  // Header Menu Items
  headerMenu: MenuItem[];

  // Footer Menu Items (2 Sets)
  footerMenu: FooterMenuSection[];

  // SEO Configuration
  lang: string;
  display: string;
  icon: string;
  startUrl: string;
}

export const siteConfig: SiteConfig = {
  // General Site Metadata
  title: 'Small Business Services',
  siteUrl: 'https://smb.comply.me',
  name: 'Comply.Me',
  description: 'Comply.Me is a specialized and tailored solutions provider for small businesses.',
  address: 'New York, NY',
  email: 'contact@comply.me',
  phone: '+1 (888) 888-8888',

  // Site Social Media Links
  social: [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/www.comply.me'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/comply_me/'
    },
    {
      name: 'Linkedin',
      url: 'https://www.linkedin.com/company/complyme/'
    }
  ],

  // Header Menu Items
  headerMenu: [
    {
      name: 'Home',
      slug: 'https://www.comply.me/',
    },
    // {
    //   name: 'Maintain Compliance',
    //   slug: '/regulations'
    // },
    // {
    //   name: 'Outsourcing HR',
    //   slug: '/hr-compliance'
    // },
    // {
    //   name: 'Funding',
    //   slug: '/business-funding'
    // },
    // {
    //   name: 'Business Insurance',
    //   slug: '/business-insurance'
    // },
  ],

  // Footer Menu Items (2 Sets)
  footerMenu: [
    {
      title: 'Business Services',
      items: [
        {
          name: 'Start a business',
          slug: '/formation'
        },
        {
          name: 'Compliance',
          slug: '/category/compliance/'
        },
        {
          name: 'Funding Programs',
          slug: '/business-funding'
        },
        {
          name: 'Compliance by state',
          slug: '/business-regulations-by-state'
        },
        {
          name: 'Insurance by state',
          slug: '/business-insurance-by-state'
        },
        // {
        //   name: 'Tools',
        //   slug: '/business-tools'
        // }
        // {
        //   name: 'Legal Form Drafter',
        //   slug: 'https://invoice.comply.me'
        // },
        // {
        //   name: 'Starting and Closing Business',
        //   slug: '/'
        // },
      ]
    },

    {
      title: 'Additional Info',
      items: [
        {
          name: 'Get Advice',
          slug: '/registracia/'
        },
        {
          name: 'Sitemap',
          slug: '/sitemap-pages.xml'
        },
        {
          name: 'About',
          slug: '/about'
        },
        // {
        //   name: 'Cookie Policy',
        //   slug: '/'
        // },
        // {
        //   name: 'Terms Of Use',
        //   slug: '/'
        // }
      ]
    }
  ],

  // SEO Configuration
  lang: 'en',
  display: 'standalone',
  icon: './public/favicon.ico',
  startUrl: '/',
};
