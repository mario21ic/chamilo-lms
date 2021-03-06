<?php
/* For licensing terms, see /license.txt */
/**
 *  Clean URls for the Social Network
 *
 *  The idea is to access to the user info more easily:
 *  http://campus.chamilo.org/admin instead of
 *  http://campus.chamilo.org/main/social/profile.php?1
 *  To use this you should rename the htaccess to .htaccess and check your
 *  virtualhost configuration
 *
 *  More improvements will come in next versions of Chamilo maybe in the 1.8.8
 *  @package chamilo.main
 */

$cidReset = true;
require_once 'main/inc/global.inc.php';

/**
 * Access permissions check
 */
//api_block_anonymous_users();

/**
 * Treat URL arguments
 */
$array_keys = array_keys($_GET);

if (empty($array_keys)) {
    // we cant find your friend
    header('Location: whoisonline.php');
    exit;
}

$username 	= substr($array_keys[0],0,20); // max len of an username
$friend_id 	= UserManager::get_user_id_from_username($username);

if (!$friend_id) {
    // we cant find your friend
    header('Location: whoisonline.php');
    exit;
}

Display::display_header(get_lang('UserInfo'));
echo SocialManager::display_individual_user($friend_id);
Display::display_footer();
