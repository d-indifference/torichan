import { format } from 'util';
import { localeStrings } from '@utils/locale/locale-en';

export const LOCALE: Record<string, unknown> = {
  html: localeStrings.html as string,
  luxon: localeStrings.luxon as string,
  validators: {
    isString: (field: string) => ({ message: format(localeStrings.validators['isString'], field) }),
    isNotEmpty: (field: string) => ({ message: format(localeStrings.validators['isNotEmpty'], field) }),
    minLength: (field: string, value: number) => ({ message: format(localeStrings.validators['minLength'], field, value) }),
    maxLength: (field: string, value: number) => ({ message: format(localeStrings.validators['maxLength'], field, value) }),
    isEnum: (field: string) => ({ message: format(localeStrings.validators['isEnum'], field) }),
    isUUID: (field: string) => ({ message: format(localeStrings.validators['isUUID'], field) }),
    isIp: (field: string) => ({ message: format(localeStrings.validators['isIp'], field) }),
    isEmail: (field: string) => ({ message: format(localeStrings.validators['isEmail'], field) }),
    isNumberString: (field: string) => ({ message: format(localeStrings.validators['isNumberString'], field) }),
    isFile: (field: string) => ({ message: format(localeStrings.validators['isFile'], field) }),
    maxFileSize: (field: string, size: number) => ({ message: format(localeStrings.validators['maxFileSize'], field, size) }),
    isInt: (field: string) => ({ message: format(localeStrings.validators['isInt'], field) }),
    isPositive: (field: string) => ({ message: format(localeStrings.validators['isPositive'], field) }),
    isNumber: (field: string) => ({ message: format(localeStrings.validators['isNumber'], field) }),
    isBoolean: (field: string) => ({ message: format(localeStrings.validators['isBoolean'], field) })
  },
  config: {
    commentTooLong: (slug: string, parent: number, displayNumber: number) =>
      format(localeStrings.config['commentTooLong'], slug, parent, displayNumber),
    highlightPostByModerators: localeStrings.config['highlightPostByModerators']
  },
  utils: {
    numberMustBeAnInteger: (source: string) => format(localeStrings.utils['numberMustBeAnInteger'], source),
    pageWasNotFound: localeStrings.utils['pageWasNotFound'],
    valueMustBeGreaterThanZero: localeStrings.utils['valueMustBeGreaterThanZero'],
    captchaIsInvalid: localeStrings.utils['captchaIsInvalid']
  },
  admin: {
    createNewBoard: localeStrings.admin['createNewBoard'],
    globalSiteSettings: localeStrings.admin['globalSiteSettings'],
    noPermissionToPerform: localeStrings.admin['noPermissionToPerform'],
    editBoard: (board: string) => format(localeStrings.admin['editBoard'], board),
    unknownDeletionOption: (option: string) => format(localeStrings.admin['unknownDeletionOption'], option),
    pageWasNotFound: (page: string) => format(localeStrings.admin['pageWasNotFound'], page),
    fileWasNotFound: (file: string) => format(localeStrings.admin['fileWasNotFound'], file),
    directoryNotExists: (directory: string) => format(localeStrings.admin['directoryNotExists'], directory),
    editMyProfile: localeStrings.admin['editMyProfile'],
    editProfile: localeStrings.admin['editProfile'],
    createNewStaffMember: localeStrings.admin['createNewStaffMember'],
    saveChanges: localeStrings.admin['saveChanges'],
    editProfileOfUser: (user: string) => format(localeStrings.admin['editProfileOfUser'], user),
    incorrectCredentials: localeStrings.admin['incorrectCredentials'],
    cannotDeleteUser: localeStrings.admin['cannotDeleteUser']
  },
  backend: {
    youAreBanned: (till: string) => format(localeStrings.backend['youAreBanned'], till),
    reason: localeStrings.backend['reason'],
    banWasNotFound: (id: string) => format(localeStrings.backend['banWasNotFound'], id),
    boardWasNotFound: (id: string) => format(localeStrings.backend['boardWasNotFound'], id),
    boardWasNotFoundBySlug: (slug: string) => format(localeStrings.backend['boardWasNotFoundBySlug'], slug),
    pageWasNotFound: (slug: string) => format(localeStrings.backend['pageWasNotFound'], slug),
    boardAlreadyExists: (slug: string) => format(localeStrings.backend['boardAlreadyExists'], slug),
    reservedSlug: (slug: string) => format(localeStrings.backend['reservedSlug'], slug),
    commentWasNotFound: localeStrings.backend['commentWasNotFound'],
    youCannotPost: localeStrings.backend['youCannotPost'],
    youMustBeAnonymous: localeStrings.backend['youMustBeAnonymous'],
    postingOfFilesNotAllowed: localeStrings.backend['postingOfFilesNotAllowed'],
    pleaseAttachAnyFile: localeStrings.backend['pleaseAttachAnyFile'],
    fileTooSmall: localeStrings.backend['fileTooSmall'],
    fileTooBig: localeStrings.backend['fileTooBig'],
    nameTooLong: localeStrings.backend['nameTooLong'],
    optionsTooLong: localeStrings.backend['optionsTooLong'],
    subjectTooLong: localeStrings.backend['subjectTooLong'],
    commentTooLong: localeStrings.backend['commentTooLong'],
    fileIsNotAnImage: localeStrings.backend['fileIsNotAnImage'],
    tooFrequentPosting: localeStrings.backend['tooFrequentPosting'],
    spamHasBeenDetected: localeStrings.backend['spamHasBeenDetected'],
    userWasNotFound: (id: string) => format(localeStrings.backend['spamHasBeenDetected'], id),
    userWithEmailExists: (email: string) => format(localeStrings.backend['userWithEmailExists'], email),
    userWithUsernameExists: (username: string) => format(localeStrings.backend['userWithUsernameExists'], username)
  },
  frontend: {
    valueMustBeNumber: (value: string) => format(localeStrings.backend['valueMustBeNumber'], value),
    youCannotWriteCommentWithoutSignIn: localeStrings.frontend['youCannotWriteCommentWithoutSignIn']
  },
  views: {
    constants: {
      goBack: localeStrings.views['constants']['goBack'],
      managementPanel: localeStrings.views['constants']['managementPanel'],
      dangerZone: localeStrings.views['constants']['dangerZone'],
      save: localeStrings.views['constants']['save'],
      edit: localeStrings.views['constants']['edit']
    },
    components: {
      thread: {
        file: localeStrings.views['components']['thread']['file'],
        highlightPostByModerators: localeStrings.views['components']['thread']['highlightPostByModerators'],
        deleteThisComment: localeStrings.views['components']['thread']['deleteThisComment'],
        deleteThisFile: localeStrings.views['components']['thread']['deleteThisFile'],
        deleteAllCommentsFromThisIP: localeStrings.views['components']['thread']['deleteAllCommentsFromThisIP'],
        banThisIP: localeStrings.views['components']['thread']['banThisIP'],
        reply: localeStrings.views['components']['thread']['reply'],
        omittedPosts: (replies: number, files: number, boardSlug: string, num: number) =>
          format(localeStrings.views['components']['thread']['reply'], replies, files, boardSlug, num),
        replyOnThisPost: localeStrings.views['components']['thread']['replyOnThisPost'],
        no: localeStrings.views['components']['thread']['no']
      },
      userForm: {
        username: localeStrings.views['components']['userForm']['username'],
        email: localeStrings.views['components']['userForm']['email'],
        role: localeStrings.views['components']['userForm']['role'],
        moderator: localeStrings.views['components']['userForm']['moderator'],
        administrator: localeStrings.views['components']['userForm']['administrator'],
        password: localeStrings.views['components']['userForm']['password'],
        leaveItEmpty: localeStrings.views['components']['userForm']['leaveItEmpty']
      }
    },
    fragments: {
      adminNavbar: {
        goToSite: localeStrings.views['fragments']['adminNavbar']['goToSite'],
        management: localeStrings.views['fragments']['adminNavbar']['management'],
        signOut: localeStrings.views['fragments']['adminNavbar']['signOut']
      },
      adminTabs: {
        home: localeStrings.views['fragments']['adminTabs']['home'],
        myProfile: localeStrings.views['fragments']['adminTabs']['myProfile'],
        globalSettings: localeStrings.views['fragments']['adminTabs']['globalSettings'],
        staff: localeStrings.views['fragments']['adminTabs']['staff'],
        sqlConsole: localeStrings.views['fragments']['adminTabs']['sqlConsole'],
        spamList: localeStrings.views['fragments']['adminTabs']['spamList'],
        ipFilter: localeStrings.views['fragments']['adminTabs']['ipFilter'],
        diskSpaceUsage: localeStrings.views['fragments']['adminTabs']['diskSpaceUsage'],
        boards: localeStrings.views['fragments']['adminTabs']['boards'],
        comments: localeStrings.views['fragments']['adminTabs']['comments'],
        bans: localeStrings.views['fragments']['adminTabs']['bans']
      },
      adminWelcome: {
        welcome: (username: string) => format(localeStrings.views['fragments']['adminWelcome']['welcome'], username)
      }
    },
    admin: {
      editBan: {
        newBan: localeStrings.views['admin']['editBan']['newBan'],
        createNewBan: localeStrings.views['admin']['editBan']['createNewBan'],
        ip: localeStrings.views['admin']['editBan']['ip'],
        duration: localeStrings.views['admin']['editBan']['duration'],
        minutes: localeStrings.views['admin']['editBan']['minutes'],
        hours: localeStrings.views['admin']['editBan']['hours'],
        days: localeStrings.views['admin']['editBan']['days'],
        months: localeStrings.views['admin']['editBan']['months'],
        years: localeStrings.views['admin']['editBan']['years'],
        reason: localeStrings.views['admin']['editBan']['reason'],
        banUser: localeStrings.views['admin']['editBan']['banUser']
      },
      editBoard: {
        slug: localeStrings.views['admin']['editBoard']['slug'],
        name: localeStrings.views['admin']['editBoard']['name'],
        visible: localeStrings.views['admin']['editBoard']['visible'],
        description: localeStrings.views['admin']['editBoard']['description'],
        allowPosting: localeStrings.views['admin']['editBoard']['allowPosting'],
        strictAnonymity: localeStrings.views['admin']['editBoard']['strictAnonymity'],
        threadFileAttachmentMode: localeStrings.views['admin']['editBoard']['threadFileAttachmentMode'],
        replyFileAttachmentMode: localeStrings.views['admin']['editBoard']['replyFileAttachmentMode'],
        delayAfterThread: localeStrings.views['admin']['editBoard']['delayAfterThread'],
        delayAfterReply: localeStrings.views['admin']['editBoard']['delayAfterReply'],
        seconds: localeStrings.views['admin']['editBoard']['seconds'],
        bytes: localeStrings.views['admin']['editBoard']['bytes'],
        milliseconds: localeStrings.views['admin']['editBoard']['milliseconds'],
        strict: localeStrings.views['admin']['editBoard']['strict'],
        optional: localeStrings.views['admin']['editBoard']['optional'],
        forbidden: localeStrings.views['admin']['editBoard']['forbidden'],
        minFileSize: localeStrings.views['admin']['editBoard']['minFileSize'],
        maxFileSize: localeStrings.views['admin']['editBoard']['maxFileSize'],
        allowMarkdown: localeStrings.views['admin']['editBoard']['allowMarkdown'],
        allowMarkdownExplanation: localeStrings.views['admin']['editBoard']['allowMarkdownExplanation'],
        allowTripcodes: localeStrings.views['admin']['editBoard']['allowTripcodes'],
        maxThreadsOnBoard: localeStrings.views['admin']['editBoard']['maxThreadsOnBoard'],
        bumpThread: localeStrings.views['admin']['editBoard']['bumpThread'],
        maxStringFieldSize: localeStrings.views['admin']['editBoard']['maxStringFieldSize'],
        maxStringFieldSizeExplanation: localeStrings.views['admin']['editBoard']['maxStringFieldSizeExplanation'],
        maxCommentSize: localeStrings.views['admin']['editBoard']['maxCommentSize'],
        maxThreadLivingTime: localeStrings.views['admin']['editBoard']['maxThreadLivingTime'],
        defaultPosterName: localeStrings.views['admin']['editBoard']['defaultPosterName'],
        defaultModeratorName: localeStrings.views['admin']['editBoard']['defaultModeratorName'],
        enableCaptcha: localeStrings.views['admin']['editBoard']['enableCaptcha'],
        isCaptchaCaseSensitive: localeStrings.views['admin']['editBoard']['isCaptchaCaseSensitive'],
        rules: localeStrings.views['admin']['editBoard']['rules'],
        saveChanges: localeStrings.views['admin']['editBoard']['saveChanges'],
        dangerZoneExplanation: (boardName: string) => format(localeStrings.views['admin']['editBoard']['dangerZoneExplanation'], boardName),
        deleteBoard: (boardName: string) => format(localeStrings.views['admin']['editBoard']['deleteBoard'], boardName)
      },
      editUser: {
        editUser: localeStrings.views['admin']['editUser']['editUser'],
        dangerZoneExplanation: (username: string) => format(localeStrings.views['admin']['editUser']['dangerZoneExplanation'], username),
        deleteUser: (username: string) => format(localeStrings.views['admin']['editUser']['deleteUser'], username)
      },
      globalSettings: {
        globalSiteSettings: localeStrings.views['admin']['globalSettings']['globalSiteSettings'],
        siteName: localeStrings.views['admin']['globalSettings']['siteName'],
        siteSlogan: localeStrings.views['admin']['globalSettings']['siteSlogan'],
        siteNavbar: localeStrings.views['admin']['globalSettings']['siteNavbar'],
        menuFrame: localeStrings.views['admin']['globalSettings']['menuFrame'],
        startPage: localeStrings.views['admin']['globalSettings']['startPage'],
        faqPage: localeStrings.views['admin']['globalSettings']['faqPage'],
        rulesPage: localeStrings.views['admin']['globalSettings']['rulesPage']
      },
      home: {
        currently: (totalComments: string, totalBoards: string) =>
          format(localeStrings.views['admin']['home']['currently'], totalComments, totalBoards),
        diskSpaceUsed: (used: string) => format(localeStrings.views['admin']['home']['diskSpaceUsed'], used),
        technicalInfo: localeStrings.views['admin']['home']['technicalInfo'],
        uptime: localeStrings.views['admin']['home']['uptime'],
        cpuDetails: localeStrings.views['admin']['home']['cpuDetails'],
        show: localeStrings.views['admin']['home']['show'],
        model: localeStrings.views['admin']['home']['model'],
        speed: localeStrings.views['admin']['home']['speed'],
        userTime: localeStrings.views['admin']['home']['userTime'],
        systemTime: localeStrings.views['admin']['home']['systemTime'],
        niceTime: localeStrings.views['admin']['home']['niceTime'],
        idleTime: localeStrings.views['admin']['home']['idleTime'],
        irqTime: localeStrings.views['admin']['home']['irqTime'],
        memoryUsage: localeStrings.views['admin']['home']['memoryUsage'],
        total: localeStrings.views['admin']['home']['total'],
        free: localeStrings.views['admin']['home']['free'],
        inUse: localeStrings.views['admin']['home']['inUse'],
        debugPort: localeStrings.views['admin']['home']['debugPort'],
        nodeJsDebugGuide: localeStrings.views['admin']['home']['nodeJsDebugGuide'],
        appPort: localeStrings.views['admin']['home']['appPort'],
        dockerContainerId: localeStrings.views['admin']['home']['dockerContainerId'],
        hostName: localeStrings.views['admin']['home']['hostName'],
        nodeDetails: localeStrings.views['admin']['home']['nodeDetails'],
        dependencies: localeStrings.views['admin']['home']['dependencies'],
        devDependencies: localeStrings.views['admin']['home']['devDependencies'],
        version: localeStrings.views['admin']['home']['version']
      },
      ipFilter: {
        ipFilter: localeStrings.views['admin']['ipFilter']['ipFilter'],
        ipWhiteList: localeStrings.views['admin']['ipFilter']['ipWhiteList'],
        whiteList: localeStrings.views['admin']['ipFilter']['whiteList'],
        ipBlacklist: localeStrings.views['admin']['ipFilter']['ipBlacklist'],
        blackList: localeStrings.views['admin']['ipFilter']['blackList']
      },
      listBan: {
        bans: localeStrings.views['admin']['listBan']['bans'],
        bannedBy: localeStrings.views['admin']['listBan']['bannedBy'],
        ip: localeStrings.views['admin']['listBan']['ip'],
        createdAt: localeStrings.views['admin']['listBan']['createdAt'],
        bannedTill: localeStrings.views['admin']['listBan']['bannedTill'],
        banReason: localeStrings.views['admin']['listBan']['banReason'],
        delete: localeStrings.views['admin']['listBan']['delete'],
        newBan: localeStrings.views['admin']['listBan']['newBan']
      },
      listBoard: {
        boards: localeStrings.views['admin']['listBoard']['boards'],
        slug: localeStrings.views['admin']['listBoard']['slug'],
        name: localeStrings.views['admin']['listBoard']['name'],
        newBoard: localeStrings.views['admin']['listBoard']['newBoard']
      },
      listComment: {
        comments: localeStrings.views['admin']['listComment']['comments'],
        createdAt: localeStrings.views['admin']['listComment']['createdAt'],
        ip: localeStrings.views['admin']['listComment']['ip'],
        adminPost: localeStrings.views['admin']['listComment']['adminPost'],
        name: localeStrings.views['admin']['listComment']['name'],
        options: localeStrings.views['admin']['listComment']['options'],
        subject: localeStrings.views['admin']['listComment']['subject'],
        comment: localeStrings.views['admin']['listComment']['comment'],
        file: localeStrings.views['admin']['listComment']['file'],
        link: localeStrings.views['admin']['listComment']['link'],
        delete: localeStrings.views['admin']['listComment']['delete'],
        allOfIp: localeStrings.views['admin']['listComment']['allOfIp'],
        banThisIP: localeStrings.views['admin']['listComment']['banThisIP'],
        select: localeStrings.views['admin']['listComment']['select']
      },
      listFile: {
        diskSpaceUsage: localeStrings.views['admin']['listFile']['diskSpaceUsage'],
        select: localeStrings.views['admin']['listFile']['select'],
        file: localeStrings.views['admin']['listFile']['file'],
        mime: localeStrings.views['admin']['listFile']['mime'],
        size: localeStrings.views['admin']['listFile']['size'],
        createdAt: localeStrings.views['admin']['listFile']['createdAt'],
        dimensions: localeStrings.views['admin']['listFile']['dimensions'],
        goto: localeStrings.views['admin']['listFile']['goto'],
        goToSource: localeStrings.views['admin']['listFile']['goToSource'],
        source: localeStrings.views['admin']['listFile']['source'],
        thumbnail: localeStrings.views['admin']['listFile']['thumbnail'],
        remove: localeStrings.views['admin']['listFile']['remove']
      },
      listUser: {
        username: localeStrings.views['admin']['listUser']['username'],
        email: localeStrings.views['admin']['listUser']['email'],
        role: localeStrings.views['admin']['listUser']['role'],
        staffList: localeStrings.views['admin']['listUser']['staffList'],
        newStaffMember: localeStrings.views['admin']['listUser']['newStaffMember']
      },
      signIn: {
        signInToManagementPanel: localeStrings.views['admin']['signIn']['signInToManagementPanel'],
        username: localeStrings.views['admin']['signIn']['username'],
        password: localeStrings.views['admin']['signIn']['password'],
        signIn: localeStrings.views['admin']['signIn']['signIn']
      },
      signUp: {
        signUpToManagementPanel: localeStrings.views['admin']['signUp']['signUpToManagementPanel'],
        username: localeStrings.views['admin']['signUp']['username'],
        email: localeStrings.views['admin']['signUp']['email'],
        password: localeStrings.views['admin']['signUp']['password'],
        signUp: localeStrings.views['admin']['signUp']['signUp']
      },
      spam: {
        spamList: localeStrings.views['admin']['spam']['spamList'],
        editSpamList: localeStrings.views['admin']['spam']['editSpamList'],
        spam: localeStrings.views['admin']['spam']['spam']
      },
      sqlConsole: {
        sqlConsole: localeStrings.views['admin']['sqlConsole']['sqlConsole'],
        runSql: localeStrings.views['admin']['sqlConsole']['runSql'],
        clear: localeStrings.views['admin']['sqlConsole']['clear'],
        runQuery: localeStrings.views['admin']['sqlConsole']['runQuery'],
        saveQueryResult: localeStrings.views['admin']['sqlConsole']['saveQueryResult'],
        runMutation: localeStrings.views['admin']['sqlConsole']['runMutation']
      }
    },
    board: {
      modeThread: localeStrings.views['board']['modeThread'],
      name: localeStrings.views['board']['name'],
      markMeAsAdmin: localeStrings.views['board']['markMeAsAdmin'],
      options: localeStrings.views['board']['options'],
      subject: localeStrings.views['board']['subject'],
      comment: localeStrings.views['board']['comment'],
      post: localeStrings.views['board']['post'],
      file: localeStrings.views['board']['file'],
      captcha: localeStrings.views['board']['captcha'],
      skipCaptcha: localeStrings.views['board']['skipCaptcha'],
      password: localeStrings.views['board']['password'],
      passwordExplanation: localeStrings.views['board']['passwordExplanation'],
      ruleImageSize: (size: string) => format(localeStrings.views['board']['ruleImageSize'], size),
      ruleThumbnail: localeStrings.views['board']['ruleThumbnail'],
      moderatorIsAlwaysRight: localeStrings.views['board']['moderatorIsAlwaysRight'],
      pleaseReadTheRules: localeStrings.views['board']['pleaseReadTheRules'],
      deletePost: localeStrings.views['board']['deletePost'],
      fileOnly: localeStrings.views['board']['fileOnly'],
      delete: localeStrings.views['board']['delete'],
      previous: localeStrings.views['board']['previous'],
      next: localeStrings.views['board']['next'],
      anonymous: localeStrings.views['board']['anonymous'],
      moderator: localeStrings.views['board']['moderator']
    },
    error: {
      error: localeStrings.views['error']['error'],
      toMainPage: localeStrings.views['error']['toMainPage']
    },
    index: {
      noFrames: (title: string) => format(localeStrings.views['index']['noFrames'], title)
    },
    thread: {
      replyToThread: (num: string) => format(localeStrings.views['thread']['replyToThread'], num),
      modeReply: localeStrings.views['thread']['modeReply'],
      return: localeStrings.views['thread']['return'],
      bottom: localeStrings.views['thread']['bottom'],
      top: localeStrings.views['thread']['top']
    }
  }
};
