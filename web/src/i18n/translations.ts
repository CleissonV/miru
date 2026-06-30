import { useAuthStore } from '@/stores/authStore'
import type { Language, WatchStatus, MediaType } from '@/types'

const STRINGS = {
  'pt-BR': {
    nav_home: 'Início',
    nav_search: 'Buscar',
    nav_list: 'Minha Lista',
    nav_stats: 'Estatísticas',
    nav_menu: 'Menu',
    nav_account: 'Conta',
    nav_profile: 'Meu Perfil',
    theme_light: 'Modo Claro',
    theme_dark: 'Modo Escuro',
    logout: 'Sair',
    login: 'Entrar',
    register: 'Criar conta',

    home_hero_title_1: 'Tudo que você assiste,',
    home_hero_title_2: 'em um só lugar',
    home_hero_subtitle: 'Filmes, séries, animes, doramas e mangás. Acompanhe, avalie e descubra novos títulos.',
    home_cta_start: 'Começar agora',
    home_cta_explore: 'Explorar títulos',
    home_featured: 'Em destaque',
    home_section_movies: 'Filmes em Alta',
    home_section_series: 'Séries em Alta',
    home_section_anime: 'Animes Populares',
    home_section_dorama: 'Doramas em Alta',
    home_section_manga: 'Mangás Populares',
    see_more: 'Ver mais',

    search_title: 'Buscar',
    search_placeholder: 'Buscar filme, série ou anime...',
    search_min_chars: 'Digite pelo menos 2 caracteres para buscar',
    search_no_results: 'Nenhum resultado para',
    filter_all: 'Tudo',
    filter_movies: 'Filmes',
    filter_series: 'Séries',
    filter_anime: 'Animes',
    filter_dorama: 'Doramas',
    filter_manga: 'Mangás',

    list_title: 'Minha Lista',
    list_count_one: 'título',
    list_count_many: 'títulos',
    list_status_label: 'Status',
    list_type_label: 'Tipo de mídia',
    list_empty: 'Sua lista está vazia',
    list_search_cta: 'Buscar títulos',
    status_all: 'Todos',

    stats_title: 'Estatísticas',
    stats_total: 'Total',
    stats_by_type: 'Por tipo',
    stats_by_status: 'Por status',
    stats_empty: 'Sua lista está vazia',
    stats_empty_sub: 'Adicione títulos para ver estatísticas aqui',

    profile_not_found: 'Perfil não encontrado',
    profile_member_since: 'Membro desde',
    profile_summary: 'Resumo',
    profile_recent_activity: 'Atividade recente',
    profile_language_label: 'Idioma das descrições',
    profile_language_hint: 'Vale para filmes, séries e doramas. Animes e mangás (MyAnimeList) ficam sempre em inglês.',

    detail_episodes: 'episódios',
    detail_your_rating: 'Sua nota (opcional)',
    detail_add_to_list: 'Adicionar à lista',
    detail_remove_from_list: 'Remover da lista',
    detail_lang_note: 'ℹ️ Sinopse disponível apenas em inglês (fonte: MyAnimeList).',

    status_plan_to_watch: 'Quero Assistir',
    status_watching: 'Assistindo',
    status_completed: 'Concluído',
    status_on_hold: 'Em Pausa',
    status_dropped: 'Abandonado',

    media_movie: 'Filme',
    media_series: 'Série',
    media_anime: 'Anime',
    media_dorama: 'Dorama',
    media_manga: 'Manga',
  },
  en: {
    nav_home: 'Home',
    nav_search: 'Search',
    nav_list: 'My List',
    nav_stats: 'Statistics',
    nav_menu: 'Menu',
    nav_account: 'Account',
    nav_profile: 'My Profile',
    theme_light: 'Light Mode',
    theme_dark: 'Dark Mode',
    logout: 'Log Out',
    login: 'Log In',
    register: 'Sign Up',

    home_hero_title_1: 'Everything you watch,',
    home_hero_title_2: 'in one place',
    home_hero_subtitle: 'Movies, series, anime, K-dramas and manga. Track, rate and discover new titles.',
    home_cta_start: 'Get Started',
    home_cta_explore: 'Explore Titles',
    home_featured: 'Featured',
    home_section_movies: 'Trending Movies',
    home_section_series: 'Trending Series',
    home_section_anime: 'Popular Anime',
    home_section_dorama: 'Trending K-Dramas',
    home_section_manga: 'Popular Manga',
    see_more: 'See more',

    search_title: 'Search',
    search_placeholder: 'Search movies, series or anime...',
    search_min_chars: 'Type at least 2 characters to search',
    search_no_results: 'No results for',
    filter_all: 'All',
    filter_movies: 'Movies',
    filter_series: 'Series',
    filter_anime: 'Anime',
    filter_dorama: 'K-Dramas',
    filter_manga: 'Manga',

    list_title: 'My List',
    list_count_one: 'title',
    list_count_many: 'titles',
    list_status_label: 'Status',
    list_type_label: 'Media Type',
    list_empty: 'Your list is empty',
    list_search_cta: 'Search titles',
    status_all: 'All',

    stats_title: 'Statistics',
    stats_total: 'Total',
    stats_by_type: 'By Type',
    stats_by_status: 'By Status',
    stats_empty: 'Your list is empty',
    stats_empty_sub: 'Add titles to see statistics here',

    profile_not_found: 'Profile not found',
    profile_member_since: 'Member since',
    profile_summary: 'Summary',
    profile_recent_activity: 'Recent Activity',
    profile_language_label: 'Description Language',
    profile_language_hint: 'Applies to movies, series and K-dramas. Anime and manga (MyAnimeList) are always in English.',

    detail_episodes: 'episodes',
    detail_your_rating: 'Your rating (optional)',
    detail_add_to_list: 'Add to list',
    detail_remove_from_list: 'Remove from list',
    detail_lang_note: 'ℹ️ Synopsis available in English only (source: MyAnimeList).',

    status_plan_to_watch: 'Plan to Watch',
    status_watching: 'Watching',
    status_completed: 'Completed',
    status_on_hold: 'On Hold',
    status_dropped: 'Dropped',

    media_movie: 'Movie',
    media_series: 'Series',
    media_anime: 'Anime',
    media_dorama: 'K-Drama',
    media_manga: 'Manga',
  },
} as const

export type TKey = keyof typeof STRINGS['pt-BR']

export function useLanguage(): Language {
  return useAuthStore(s => s.user?.language ?? 'pt-BR')
}

export function useT() {
  const lang = useLanguage()
  return (key: TKey) => STRINGS[lang][key]
}

export function useStatusLabel(): Record<WatchStatus, string> {
  const lang = useLanguage()
  return {
    PLAN_TO_WATCH: STRINGS[lang].status_plan_to_watch,
    WATCHING: STRINGS[lang].status_watching,
    COMPLETED: STRINGS[lang].status_completed,
    ON_HOLD: STRINGS[lang].status_on_hold,
    DROPPED: STRINGS[lang].status_dropped,
  }
}

export function useMediaLabel(): Record<MediaType, string> {
  const lang = useLanguage()
  return {
    MOVIE: STRINGS[lang].media_movie,
    SERIES: STRINGS[lang].media_series,
    ANIME: STRINGS[lang].media_anime,
    DORAMA: STRINGS[lang].media_dorama,
    MANGA: STRINGS[lang].media_manga,
  }
}
