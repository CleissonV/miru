import { useAuthStore, type Language } from '@/stores/authStore'
import type { WatchStatus, MediaType } from '@/types'

const STRINGS = {
  'pt-BR': {
    nav_home: 'Início',
    nav_search: 'Buscar',
    nav_list: 'Minha Lista',
    nav_stats: 'Stats',
    nav_profile: 'Perfil',

    home_greeting: 'Olá',
    home_subtitle: 'Filmes, séries, animes, doramas e mangás',
    home_section_movies: 'Filmes em Alta',
    home_section_series: 'Séries em Alta',
    home_section_anime: 'Animes Populares',
    home_section_dorama: 'Doramas em Alta',
    home_section_manga: 'Mangás Populares',

    search_placeholder: 'Buscar filme, série ou anime...',
    search_min_chars: 'Digite pelo menos 2 caracteres',
    search_no_results: 'Nenhum resultado para',
    filter_all: 'Tudo',
    filter_movies: 'Filmes',
    filter_series: 'Séries',
    filter_anime: 'Animes',
    filter_dorama: 'Doramas',
    filter_manga: 'Mangás',

    list_count_one: 'título',
    list_count_many: 'títulos',
    list_empty: 'Sua lista está vazia',
    list_search_cta: 'Buscar títulos',
    status_all: 'Todos',

    stats_total_titles: 'títulos na lista',
    stats_by_type: 'Por tipo de mídia',
    stats_by_status: 'Por status',
    stats_completed_suffix: 'concluídos',

    profile_username: 'Nome de usuário',
    profile_email: 'E-mail',
    profile_name: 'Nome',
    profile_language_label: 'IDIOMA DAS DESCRIÇÕES',
    profile_language_hint: 'Vale para filmes, séries e doramas. Animes e mangás ficam sempre em inglês.',
    profile_logout: 'Sair da conta',
    profile_logout_confirm_title: 'Sair',
    profile_logout_confirm_msg: 'Tem certeza que deseja sair?',
    cancel: 'Cancelar',

    detail_lang_note: 'ℹ️ Sinopse disponível apenas em inglês (fonte: MyAnimeList).',
    detail_in_list: 'Na sua lista',
    detail_add_to_list: '+ Adicionar à lista',
    detail_update_in_list: 'Atualizar na lista',
    detail_choose_status: 'Escolher status',
    detail_remove_from_list: 'Remover da lista',
    detail_remove_confirm_title: 'Remover',
    detail_remove_confirm_msg: 'Remover da lista?',
    detail_remove: 'Remover',
    detail_episodes_suffix: 'eps',
    detail_save_error_title: 'Erro',
    detail_save_error_msg: 'Não foi possível salvar',

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

    login_title: 'Entrar no Miru',
    login_subtitle: 'Acompanhe tudo que você assiste',
    email_placeholder: 'E-mail',
    password_placeholder: 'Senha',
    login_btn: 'Entrar',
    login_no_account: 'Não tem conta? ',
    login_register_link: 'Cadastre-se',
    login_fill_fields: 'Preencha todos os campos',
    login_error: 'Erro ao entrar',

    register_title: 'Criar conta',
    register_subtitle: 'Gratuito, sem anúncios',
    register_username_placeholder: 'Nome de usuário *',
    register_displayname_placeholder: 'Nome de exibição',
    register_email_placeholder: 'E-mail *',
    register_password_placeholder: 'Senha *',
    register_btn: 'Criar conta',
    register_has_account: 'Já tem conta? ',
    register_login_link: 'Entrar',
    register_fill_fields: 'Preencha os campos obrigatórios',
    register_error: 'Erro ao criar conta',
  },
  en: {
    nav_home: 'Home',
    nav_search: 'Search',
    nav_list: 'My List',
    nav_stats: 'Stats',
    nav_profile: 'Profile',

    home_greeting: 'Hi',
    home_subtitle: 'Movies, series, anime, K-dramas and manga',
    home_section_movies: 'Trending Movies',
    home_section_series: 'Trending Series',
    home_section_anime: 'Popular Anime',
    home_section_dorama: 'Trending K-Dramas',
    home_section_manga: 'Popular Manga',

    search_placeholder: 'Search movies, series or anime...',
    search_min_chars: 'Type at least 2 characters',
    search_no_results: 'No results for',
    filter_all: 'All',
    filter_movies: 'Movies',
    filter_series: 'Series',
    filter_anime: 'Anime',
    filter_dorama: 'K-Dramas',
    filter_manga: 'Manga',

    list_count_one: 'title',
    list_count_many: 'titles',
    list_empty: 'Your list is empty',
    list_search_cta: 'Search titles',
    status_all: 'All',

    stats_total_titles: 'titles in list',
    stats_by_type: 'By media type',
    stats_by_status: 'By status',
    stats_completed_suffix: 'completed',

    profile_username: 'Username',
    profile_email: 'Email',
    profile_name: 'Name',
    profile_language_label: 'DESCRIPTION LANGUAGE',
    profile_language_hint: 'Applies to movies, series and K-dramas. Anime and manga are always in English.',
    profile_logout: 'Log out',
    profile_logout_confirm_title: 'Log out',
    profile_logout_confirm_msg: 'Are you sure you want to log out?',
    cancel: 'Cancel',

    detail_lang_note: 'ℹ️ Synopsis available in English only (source: MyAnimeList).',
    detail_in_list: 'In your list',
    detail_add_to_list: '+ Add to list',
    detail_update_in_list: 'Update in list',
    detail_choose_status: 'Choose status',
    detail_remove_from_list: 'Remove from list',
    detail_remove_confirm_title: 'Remove',
    detail_remove_confirm_msg: 'Remove from list?',
    detail_remove: 'Remove',
    detail_episodes_suffix: 'eps',
    detail_save_error_title: 'Error',
    detail_save_error_msg: 'Could not save',

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

    login_title: 'Log in to Miru',
    login_subtitle: 'Track everything you watch',
    email_placeholder: 'Email',
    password_placeholder: 'Password',
    login_btn: 'Log in',
    login_no_account: "Don't have an account? ",
    login_register_link: 'Sign up',
    login_fill_fields: 'Fill in all fields',
    login_error: 'Error logging in',

    register_title: 'Create account',
    register_subtitle: 'Free, no ads',
    register_username_placeholder: 'Username *',
    register_displayname_placeholder: 'Display name',
    register_email_placeholder: 'Email *',
    register_password_placeholder: 'Password *',
    register_btn: 'Create account',
    register_has_account: 'Already have an account? ',
    register_login_link: 'Log in',
    register_fill_fields: 'Fill in the required fields',
    register_error: 'Error creating account',
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
