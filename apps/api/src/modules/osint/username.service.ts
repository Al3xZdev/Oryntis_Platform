import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface Platform {
  name: string;
  baseUrl: string;
  checkPath: (username: string) => string;
}

@Injectable()
export class UsernameService {
  // 100+ plataformas populares para búsqueda de usernames
  private readonly platforms: Platform[] = [
    // Redes sociales principales
    { name: 'Instagram', baseUrl: 'https://www.instagram.com/', checkPath: (u) => `@${u}` },
    { name: 'Twitter/X', baseUrl: 'https://twitter.com/', checkPath: (u) => `${u}` },
    { name: 'Facebook', baseUrl: 'https://www.facebook.com/', checkPath: (u) => `${u}` },
    { name: 'YouTube', baseUrl: 'https://www.youtube.com/', checkPath: (u) => `@${u}` },
    { name: 'TikTok', baseUrl: 'https://www.tiktok.com/', checkPath: (u) => `@${u}` },
    { name: 'LinkedIn', baseUrl: 'https://www.linkedin.com/', checkPath: (u) => `in/${u}` },
    { name: 'Pinterest', baseUrl: 'https://www.pinterest.com/', checkPath: (u) => `${u}` },
    { name: 'Reddit', baseUrl: 'https://www.reddit.com/', checkPath: (u) => `user/${u}` },
    { name: 'Snapchat', baseUrl: 'https://www.snapchat.com/', checkPath: (u) => `add/${u}` },
    { name: 'Tumblr', baseUrl: 'https://www.tumblr.com/', checkPath: (u) => `${u}` },
    
    // Plataformas de código
    { name: 'GitHub', baseUrl: 'https://github.com/', checkPath: (u) => `${u}` },
    { name: 'GitLab', baseUrl: 'https://gitlab.com/', checkPath: (u) => `${u}` },
    { name: 'Bitbucket', baseUrl: 'https://bitbucket.org/', checkPath: (u) => `${u}` },
    { name: 'Stack Overflow', baseUrl: 'https://stackoverflow.com/', checkPath: (u) => `users/${u}` },
    { name: 'DEV.to', baseUrl: 'https://dev.to/', checkPath: (u) => `${u}` },
    { name: 'Replit', baseUrl: 'https://replit.com/', checkPath: (u) => `@${u}` },
    { name: 'CodePen', baseUrl: 'https://codepen.io/', checkPath: (u) => `${u}` },
    { name: 'JSFiddle', baseUrl: 'https://jsfiddle.net/', checkPath: (u) => `user/${u}` },
    { name: 'LeetCode', baseUrl: 'https://leetcode.com/', checkPath: (u) => `${u}` },
    { name: 'HackerRank', baseUrl: 'https://www.hackerrank.com/', checkPath: (u) => `${u}` },
    
    // Streaming/Gaming
    { name: 'Twitch', baseUrl: 'https://www.twitch.tv/', checkPath: (u) => `${u}` },
    { name: 'Discord', baseUrl: 'https://discord.com/', checkPath: (u) => `users/${u}` },
    { name: 'Steam', baseUrl: 'https://steamcommunity.com/', checkPath: (u) => `id/${u}` },
    { name: 'Roblox', baseUrl: 'https://www.roblox.com/', checkPath: (u) => `user/${u}` },
    { name: 'Epic Games', baseUrl: 'https://www.epicgames.com/', checkPath: (u) => `id/${u}` },
    { name: 'GOG', baseUrl: 'https://www.gog.com/', checkPath: (u) => `u/${u}` },
    { name: 'Troll', baseUrl: 'https://www.trovo.live/', checkPath: (u) => `${u}` },
    { name: 'Dlive', baseUrl: 'https://dlive.tv/', checkPath: (u) => `${u}` },
    { name: 'Kick', baseUrl: 'https://kick.com/', checkPath: (u) => `${u}` },
    
    // Música/Audio
    { name: 'SoundCloud', baseUrl: 'https://soundcloud.com/', checkPath: (u) => `${u}` },
    { name: 'Spotify', baseUrl: 'https://open.spotify.com/', checkPath: (u) => `user/${u}` },
    { name: 'Bandcamp', baseUrl: 'https://bandcamp.com/', checkPath: (u) => `${u}` },
    { name: 'Mixcloud', baseUrl: 'https://www.mixcloud.com/', checkPath: (u) => `${u}` },
    { name: 'Vimeo', baseUrl: 'https://vimeo.com/', checkPath: (u) => `${u}` },
    { name: 'Audiomack', baseUrl: 'https://audiomack.com/', checkPath: (u) => `${u}` },
    { name: 'ReverbNation', baseUrl: 'https://www.reverbnation.com/', checkPath: (u) => `${u}` },
    { name: 'Discogs', baseUrl: 'https://www.discogs.com/', checkPath: (u) => `search?type=artist&q=${u}` },
    { name: 'Last.fm', baseUrl: 'https://www.last.fm/', checkPath: (u) => `user/${u}` },
    
    // Blogging/Writing
    { name: 'Medium', baseUrl: 'https://medium.com/', checkPath: (u) => `@${u}` },
    { name: 'WordPress', baseUrl: 'https://wordpress.com/', checkPath: (u) => `${u}` },
    { name: 'Blogger', baseUrl: 'https://www.blogger.com/', checkPath: (u) => `profile/${u}` },
    { name: 'Wix', baseUrl: 'https://www.wix.com/', checkPath: (u) => `${u}` },
    { name: 'Squarespace', baseUrl: 'https://www.squarespace.com/', checkPath: (u) => `${u}` },
    { name: 'Ghost', baseUrl: 'https://ghost.org/', checkPath: (u) => `${u}` },
    { name: 'Substack', baseUrl: 'https://substack.com/', checkPath: (u) => `@${u}` },
    { name: 'Hashnode', baseUrl: 'https://hashnode.com/', checkPath: (u) => `@${u}` },
    
    // Fotografía/Arte
    { name: 'Behance', baseUrl: 'https://www.behance.net/', checkPath: (u) => `${u}` },
    { name: 'Dribbble', baseUrl: 'https://dribbble.com/', checkPath: (u) => `${u}` },
    { name: 'DeviantArt', baseUrl: 'https://www.deviantart.com/', checkPath: (u) => `${u}` },
    { name: 'ArtStation', baseUrl: 'https://www.artstation.com/', checkPath: (u) => `${u}` },
    { name: 'Flickr', baseUrl: 'https://www.flickr.com/', checkPath: (u) => `photos/${u}` },
    { name: '500px', baseUrl: 'https://500px.com/', checkPath: (u) => `${u}` },
    { name: 'Unsplash', baseUrl: 'https://unsplash.com/', checkPath: (u) => `@${u}` },
    { name: 'Pexels', baseUrl: 'https://www.pexels.com/', checkPath: (u) => `@${u}` },
    
    // Dating/Cards
    { name: 'Tinder', baseUrl: 'https://tinder.com/', checkPath: (u) => `@${u}` },
    { name: 'Bumble', baseUrl: 'https://bumble.com/', checkPath: (u) => `u/${u}` },
    { name: 'Hinge', baseUrl: 'https://hinge.co/', checkPath: (u) => `${u}` },
    { name: 'OkCupid', baseUrl: 'https://www.okcupid.com/', checkPath: (u) => `${u}` },
    { name: 'Coffee Meets Bagel', baseUrl: 'https://coffee meets bagel.com/', checkPath: (u) => `${u}` },
    
    // Shopping/E-commerce
    { name: 'Etsy', baseUrl: 'https://www.etsy.com/', checkPath: (u) => `people/${u}` },
    { name: 'eBay', baseUrl: 'https://www.ebay.com/', checkPath: (u) => `usr/${u}` },
    { name: 'Poshmark', baseUrl: 'https://poshmark.com/', checkPath: (u) => `profile/${u}` },
    { name: 'Depop', baseUrl: 'https://www.depop.com/', checkPath: (u) => `${u}` },
    { name: 'MercadoLibre', baseUrl: 'https://www.mercadolibre.com/', checkPath: (u) => `perfil/${u}` },
    
    // Educación
    { name: 'Khan Academy', baseUrl: 'https://www.khanacademy.org/', checkPath: (u) => `profile/${u}` },
    { name: 'Coursera', baseUrl: 'https://www.coursera.org/', checkPath: (u) => ` learner/${u}` },
    { name: 'Udemy', baseUrl: 'https://www.udemy.com/', checkPath: (u) => `user/${u}` },
    { name: 'Skillshare', baseUrl: 'https://www.skillshare.com/', checkPath: (u) => `profile/${u}` },
    { name: 'Duolingo', baseUrl: 'https://duolingo.com/', checkPath: (u) => `profile/${u}` },
    
    // Fintech/Crypto
    { name: 'PayPal', baseUrl: 'https://paypal.com/', checkPath: (u) => `pay/${u}` },
    { name: 'Venmo', baseUrl: 'https://venmo.com/', checkPath: (u) => `${u}` },
    { name: 'Cash App', baseUrl: 'https://cash.app/', checkPath: (u) => `$${u}` },
    { name: 'Crypto.com', baseUrl: 'https://crypto.com/', checkPath: (u) => `u/${u}` },
    { name: 'Patreon', baseUrl: 'https://www.patreon.com/', checkPath: (u) => `${u}` },
    { name: 'Ko-fi', baseUrl: 'https://ko-fi.com/', checkPath: (u) => `${u}` },
    { name: 'Buy Me a Coffee', baseUrl: 'https://www.buymeacoffee.com/', checkPath: (u) => `${u}` },
    
    // Foros/Comunidad
    { name: 'Discord', baseUrl: 'https://discord.com/', checkPath: (u) => `users/${u}` },
    { name: 'Slack', baseUrl: 'https://slack.com/', checkPath: (u) => `team/${u}` },
    { name: 'Telegram', baseUrl: 'https://t.me/', checkPath: (u) => `${u}` },
    { name: 'WhatsApp', baseUrl: 'https://wa.me/', checkPath: (u) => `${u}` },
    { name: 'Viber', baseUrl: 'https://viber.com/', checkPath: (u) => `${u}` },
    
    // News/Blogs
    { name: 'Mastodon', baseUrl: 'https://mastodon.social/', checkPath: (u) => `@${u}@mastodon.social` },
    { name: 'Gettr', baseUrl: 'https://gettr.com/', checkPath: (u) => `user/${u}` },
    { name: 'Parler', baseUrl: 'https://parler.com/', checkPath: (u) => `profile/${u}` },
    { name: 'Truth Social', baseUrl: 'https://truthsocial.com/', checkPath: (u) => `@${u}` },
    
    // Viajes
    { name: 'Airbnb', baseUrl: 'https://www.airbnb.com/', checkPath: (u) => `users/${u}` },
    { name: 'Booking', baseUrl: 'https://www.booking.com/', checkPath: (u) => `user/${u}` },
    { name: 'TripAdvisor', baseUrl: 'https://www.tripadvisor.com/', checkPath: (u) => `Profile/${u}` },
    
    // Misc
    { name: 'Wikipedia', baseUrl: 'https://en.wikipedia.org/', checkPath: (u) => `User:${u}` },
    { name: 'IMDb', baseUrl: 'https://www.imdb.com/', checkPath: (u) => `user/${u}` },
    { name: 'Product Hunt', baseUrl: 'https://www.producthunt.com/', checkPath: (u) => `@${u}` },
    { name: 'SlideShare', baseUrl: 'https://www.slideshare.net/', checkPath: (u) => `${u}` },
    { name: 'Scribd', baseUrl: 'https://www.scribd.com/', checkPath: (u) => `people/${u}` },
    { name: 'Pocket', baseUrl: 'https://getpocket.com/', checkPath: (u) => `user/${u}` },
    { name: 'StumbleUpon', baseUrl: 'https://www.stumbleupon.com/', checkPath: (u) => `stumbler/${u}` },
    { name: 'LiveJournal', baseUrl: 'https://www.livejournal.com/', checkPath: (u) => `${u}` },
    { name: 'Xing', baseUrl: 'https://www.xing.com/', checkPath: (u) => `profile/${u}` },
    { name: 'WeChat', baseUrl: 'https://wechat.com/', checkPath: (u) => `u/${u}` },
    { name: 'Line', baseUrl: 'https://line.me/', checkPath: (u) => `ti/p/${u}` },
    { name: 'Kik', baseUrl: 'https://kik.com/', checkPath: (u) => `${u}` },
    { name: 'Telegram', baseUrl: 'https://telegram.me/', checkPath: (u) => `${u}` },
    { name: 'OnlyFans', baseUrl: 'https://onlyfans.com/', checkPath: (u) => `${u}` },
    { name: 'Wish', baseUrl: 'https://www.wish.com/', checkPath: (u) => `user/${u}` },
    { name: 'Redbubble', baseUrl: 'https://www.redbubble.com/', checkPath: (u) => `people/${u}` },
    { name: 'Teespring', baseUrl: 'https://teespring.com/', checkPath: (u) => `stores/${u}` },
    { name: 'Gumroad', baseUrl: 'https://gumroad.com/', checkPath: (u) => `${u}` },
    { name: 'Kofi', baseUrl: 'https://ko-fi.com/', checkPath: (u) => `${u}` },
  ];

  async search(username: string): Promise<any> {
    const found: any[] = [];
    const notFound: any[] = [];
    const errors: any[] = [];
    const startTime = Date.now();

    // Buscar en paralelo (limitado a 20 para evitar timeouts)
    const platformsToSearch = this.platforms.slice(0, 30);
    
    const promises = platformsToSearch.map(async (platform) => {
      const url = platform.baseUrl + platform.checkPath(username);
      const platformStartTime = Date.now();
      
      try {
        const response = await axios.get(url, {
          timeout: 5000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
          validateStatus: (status) => status < 500,
        });

        const responseTime = Date.now() - platformStartTime;

        // Verificar si el usuario existe
        if (response.status === 200) {
          const exists = this.checkIfUserExists(response.data, platform.name);
          if (exists) {
            return {
              platform: platform.name,
              url: url,
              status: 'found',
              response_time_ms: responseTime,
            };
          }
        }
        
        // Si es 404 o 403, no existe
        if (response.status === 404 || response.status === 403) {
          return {
            platform: platform.name,
            url: url,
            status: 'not_found',
            response_time_ms: responseTime,
          };
        }
        
        // Para otros códigos, asumir que existe si no podemos determinarlo
        return {
          platform: platform.name,
          url: url,
          status: response.status === 200 ? 'found' : 'unknown',
          response_time_ms: responseTime,
        };
        
      } catch (error: any) {
        return {
          platform: platform.name,
          url: url,
          status: 'error',
          error: error.message || 'Request failed',
          response_time_ms: Date.now() - platformStartTime,
        };
      }
    });

    const results = await Promise.allSettled(promises);
    
    // Procesar resultados
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        if (result.value.status === 'found') {
          found.push(result.value);
        } else if (result.value.status === 'not_found') {
          notFound.push(result.value);
        } else {
          // unknown o error - agregar a no encontrado por seguridad
          notFound.push(result.value);
        }
      }
    }

    return {
      success: true,
      username,
      total_platforms: this.platforms.length,
      searched_platforms: platformsToSearch.length,
      found_count: found.length,
      found: found,
      not_found: notFound,
      errors: errors,
      execution_time_ms: Date.now() - startTime,
    };
  }

  // Verificar si el usuario realmente existe en el contenido de la respuesta
  private checkIfUserExists(html: string, platform: string): boolean {
    if (!html || typeof html !== 'string') return false;
    
    const notFoundPatterns = [
      'page not found',
      'user not found',
      'account does not exist',
      'not found',
      "doesn't exist",
      'this page doesn',
      'invalid username',
      'profile not found',
      'no se encontró',
      'usuário não encontrado',
      'does not exist',
      'may be private',
      'has been removed',
    ];

    const lowerHtml = html.toLowerCase();
    
    for (const pattern of notFoundPatterns) {
      if (lowerHtml.includes(pattern)) {
        return false;
      }
    }

    return true;
  }
}