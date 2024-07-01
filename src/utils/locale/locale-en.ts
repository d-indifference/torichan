export const localeStrings: Record<string, unknown> = {
  html: 'en',
  luxon: 'en',
  validators: {
    isString: '%s: must be a string',
    isNotEmpty: '%s: must be not empty',
    minLength: '%s: must be at least %d characters',
    maxLength: '%s: must be no more than %d characters',
    isEnum: '%s: must be enum',
    isUUID: '%s: must be a UUIDv4',
    isIp: '%s: must be IPv4',
    isEmail: '%s: must be an email',
    isNumberString: '%s: must be a number string',
    isFile: '%s must be a file',
    maxFileSize: '%s: must be less than %d bytes.',
    isInt: '%s: must be an integer',
    isPositive: '%s: must be positive number',
    isNumber: '%s: must be a number',
    isBoolean: '%s: must be a boolean'
  },
  config: {
    commentTooLong: 'Comment too long. <a href="/%s/res/%d#%d">Click here</a> to view the full text.',
    highlightPostByModerators: 'Highlight posts by Moderators'
  },
  utils: {
    numberMustBeAnInteger: 'Number: %s must be an integer',
    pageWasNotFound: 'Page was not found',
    valueMustBeGreaterThanZero: 'Value must be greater than 0',
    captchaIsInvalid: 'Captcha is invalid!'
  },
  admin: {
    createNewBoard: 'Create new board',
    globalSiteSettings: 'Global site settings',
    noPermissionToPerform: 'You do not have permission to perform this action.',
    editBoard: 'Edit board: %s',
    unknownDeletionOption: 'Unknown deletion option: %s',
    pageWasNotFound: 'Page: %s was not found.',
    fileWasNotFound: 'File: %s was not found',
    directoryNotExists: 'Directory not exist on disk: %s.',
    editMyProfile: 'Edit my profile',
    editProfile: 'Edit profile',
    createNewStaffMember: 'Create new staff member',
    saveChanges: 'Save changes',
    editProfileOfUser: 'Edit profile of user: %s',
    incorrectCredentials: 'The username or password you entered is incorrect.',
    cannotDeleteUser: 'You cannot delete this user.'
  },
  backend: {
    youAreBanned: 'You`re banned till %s',
    reason: 'Reason: ',
    banWasNotFound: 'Ban by ID: %s was not found',
    boardWasNotFound: 'Board with %s: was not found',
    boardWasNotFoundBySlug: 'Board with slug: %s was not found',
    pageWasNotFound: 'Page with address: /%s was not found',
    boardAlreadyExists: 'Board with slug: %s already exists',
    reservedSlug: 'This slug is reserved by system: %s. You cannot create a board with it.',
    commentWasNotFound: 'Comment was not found',
    youCannotPost: 'You cannot post any comments to this board!',
    youMustBeAnonymous: 'You must be anonymous on this board!',
    postingOfFilesNotAllowed: 'Posting of files is not allowed here!',
    pleaseAttachAnyFile: 'Please attach any file.',
    fileTooSmall: 'Your file is too small.',
    fileTooBig: 'Your file is too big.',
    nameTooLong: 'Your name is too long',
    optionsTooLong: 'Your options is too long',
    subjectTooLong: 'Your subject is too long',
    commentTooLong: 'Your comment is too long',
    fileIsNotAnImage: 'Attachment file is not an image',
    tooFrequentPosting: 'You are trying to send comments too frequent!',
    spamHasBeenDetected: 'Spam has been detected in your inputs.',
    userWasNotFound: 'User with id: %s was not found',
    userWithEmailExists: 'User with email: %s already exists',
    userWithUsernameExists: 'User with username: %s already exists'
  },
  frontend: {
    valueMustBeNumber: 'Value %s must be number',
    youCannotWriteCommentWithoutSignIn: 'You cannot write comments as admin without signing in.'
  },
  views: {
    constants: {
      goBack: 'Go back',
      managementPanel: 'Management panel',
      dangerZone: 'Danger zone',
      save: 'Save',
      edit: 'Edit'
    },
    components: {
      thread: {
        file: 'File',
        highlightPostByModerators: 'Highlight posts by Moderators',
        deleteThisComment: 'Delete this comment',
        deleteThisFile: 'Delete this file',
        deleteAllCommentsFromThisIP: 'Delete all comments from this IP',
        banThisIP: 'Ban this IP',
        reply: 'Reply',
        omittedPosts: '%d replies and %d files omitted. <a href="/%s/res/%d">Click here</a> to view them.',
        replyOnThisPost: 'Reply on this post',
        no: 'No.'
      },
      userForm: {
        username: 'Username',
        email: 'Email',
        role: 'Role',
        moderator: 'Moderator',
        administrator: 'Administrator',
        password: 'Password',
        leaveItEmpty: 'Leave it empty if you don`t want to change it.'
      }
    },
    fragments: {
      adminNavbar: {
        goToSite: 'Go to site',
        management: 'Management',
        signOut: 'Sign out'
      },
      adminTabs: {
        home: 'Home',
        myProfile: 'My profile',
        globalSettings: 'Global settings',
        staff: 'Staff',
        sqlConsole: 'SQL Console',
        spamList: 'Spam list',
        ipFilter: 'IP filter',
        diskSpaceUsage: 'Disk space usage',
        boards: 'Boards',
        comments: 'Comments',
        bans: 'Bans'
      },
      adminWelcome: {
        welcome: 'Welcome, <a href="/admin/staff/me">%s</a>'
      }
    },
    admin: {
      editBan: {
        newBan: 'New Ban',
        createNewBan: 'Create new ban',
        ip: 'IP',
        duration: 'Duration',
        minutes: 'Minutes',
        hours: 'Hours',
        days: 'Days',
        months: 'Months',
        years: 'Years',
        reason: 'Reason',
        banUser: 'Ban user'
      },
      editBoard: {
        slug: 'Slug',
        name: 'Name',
        visible: 'Visible',
        description: 'Description',
        allowPosting: 'Allow Posting',
        strictAnonymity: 'Strict anonymity',
        threadFileAttachmentMode: 'Thread file attachment',
        replyFileAttachmentMode: 'Reply file attachment',
        delayAfterThread: 'Delay After thread',
        delayAfterReply: 'Delay After reply',
        seconds: 'seconds',
        bytes: 'bytes',
        milliseconds: 'milliseconds',
        strict: 'Strict',
        optional: 'Optional',
        forbidden: 'Forbidden',
        minFileSize: 'Minimum file size',
        maxFileSize: 'Maximum file size',
        allowMarkdown: 'Allow markdown',
        allowMarkdownExplanation: 'If you uncheck the box, then the only markdown that will be available to you is replies, citations and links',
        allowTripcodes: 'Allow Tripcodes',
        maxThreadsOnBoard: 'Maximum thread on boards',
        bumpThread: 'Bump limit',
        maxStringFieldSize: 'Max string field size',
        maxStringFieldSizeExplanation: 'Name, options, subject',
        maxCommentSize: 'Max comment size',
        maxThreadLivingTime: 'Max thread living time',
        defaultPosterName: 'Default poster name',
        defaultModeratorName: 'Default moderator name',
        enableCaptcha: 'Enable captcha',
        rules: 'Rules',
        saveChanges: 'Save changes',
        dangerZoneExplanation: `Deleting the board "%s" once will mean that you will never be able to restore this record.<br>
          <u>Are you sure of your intentions?</u>`,
        deleteBoard: 'Delete board "%s"'
      },
      editUser: {
        editUser: 'Edit user',
        dangerZoneExplanation: `Deleting the user "%s" once will mean that you will never be able to restore this record.<br>
                <u>Are you sure of your intentions?</u>`,
        deleteUser: 'Delete user "%s"'
      },
      globalSettings: {
        globalSiteSettings: 'Global site settings',
        siteName: 'Site name',
        siteSlogan: 'Site slogan',
        siteNavbar: 'Site navbar',
        menuFrame: 'Menu frame',
        startPage: 'Start page',
        faqPage: 'FAQ page',
        rulesPage: 'Rules page'
      },
      home: {
        currently: 'Currently, there are <strong>%s</strong> posts on <strong>%s</strong> boards',
        diskSpaceUsed: '<a href="/admin/file">Disk space used</a> is <strong>%s</strong>',
        technicalInfo: 'Technical Info',
        uptime: 'Uptime (seconds)',
        cpuDetails: 'CPU details',
        show: 'Show',
        model: 'model',
        speed: 'speed',
        userTime: 'user usage time (microseconds)',
        systemTime: 'system usage time (microseconds)',
        niceTime: 'nice mode time (microseconds)',
        idleTime: 'idle mode time (microseconds)',
        irqTime: 'irq mode time (microseconds)',
        memoryUsage: 'Memory usage:',
        total: 'Total',
        free: 'Free',
        inUse: 'In use',
        debugPort: 'Debug port:',
        nodeJsDebugGuide: 'see <a href="https://nodejs.org/en/docs/guides/debugging-getting-started" target="_blank">Node.js Debugging Guide</a>',
        appPort: 'App port:',
        dockerContainerId: 'Docker container ID',
        hostName: 'Host name',
        nodeDetails: 'Node details',
        dependencies: 'Dependencies',
        devDependencies: 'Dev Dependencies',
        version: 'version'
      },
      ipFilter: {
        ipFilter: 'IP filter',
        ipWhiteList: 'IP Whitelist',
        whiteList: 'Whitelist',
        ipBlacklist: 'IP Blacklist',
        blackList: 'Blacklist'
      },
      listBan: {
        bans: 'Bans',
        bannedBy: 'Banned by',
        ip: 'IP',
        createdAt: 'Created at',
        bannedTill: 'Banned till',
        banReason: 'Ban reason',
        delete: 'Delete',
        newBan: 'New ban'
      },
      listBoard: {
        boards: 'Boards',
        slug: 'Slug',
        name: 'Name',
        newBoard: 'New board'
      },
      listComment: {
        comments: 'Comments',
        createdAt: 'Created at',
        ip: 'IP',
        adminPost: 'Admin`s post',
        name: 'Name',
        options: 'Options',
        subject: 'Subject',
        comment: 'Comment',
        file: 'File',
        link: 'Link',
        delete: 'Delete',
        allOfIp: 'All of IP',
        banThisIP: 'Ban this IP',
        select: 'Select'
      },
      listFile: {
        diskSpaceUsage: 'Disk space usage',
        select: 'Select',
        file: 'File',
        mime: 'MIME',
        size: 'Size',
        createdAt: 'Created at',
        dimensions: 'Dimensions',
        goto: 'Go to',
        goToSource: 'Go to source',
        source: 'Source',
        thumbnail: 'Thumbnail',
        remove: 'Remove'
      },
      listUser: {
        username: 'Username',
        email: 'Email',
        role: 'Role',
        staffList: 'Staff list',
        newStaffMember: 'New staff member'
      },
      signIn: {
        signInToManagementPanel: 'Sign in to management panel',
        username: 'Username',
        password: 'Password',
        signIn: 'Sign in'
      },
      signUp: {
        signUpToManagementPanel: 'Sign up to Management panel',
        username: 'Username',
        email: 'Email',
        password: 'Password',
        signUp: 'Sign up'
      },
      spam: {
        spamList: 'Spam list',
        editSpamList: 'Edit spam list',
        spam: 'Spam'
      },
      sqlConsole: {
        sqlConsole: 'SQL Console',
        runSql: 'Run SQL (PostgreSQL) query',
        clear: 'Clear',
        runQuery: 'Run query (I know, what I am doing)',
        saveQueryResult: 'Save query result (JSON)'
      }
    },
    board: {
      modeThread: 'Mode: Thread',
      name: 'Name',
      markMeAsAdmin: 'Mark me as administrator',
      options: 'Options',
      subject: 'Subject',
      comment: 'Comment',
      post: 'Post',
      file: 'File',
      captcha: 'Captcha',
      skipCaptcha: 'Tick `Mark me as administrator` to skip the captcha',
      password: 'Password',
      passwordExplanation: '(For comments & files deletion)',
      ruleImageSize: 'Image files up to %s in size are supported.',
      ruleThumbnail: 'Images larger than 200x200 will be reduced in size.',
      moderatorIsAlwaysRight: 'Moderator is always right.',
      pleaseReadTheRules: 'Please read the <a href="/rules">Rules</a> and <a href="/faq">FAQ</a> before posting.',
      deletePost: 'Delete post:',
      fileOnly: 'File only',
      delete: 'Delete',
      previous: 'Previous',
      next: 'Next',
      anonymous: 'Anonymous',
      moderator: 'Moderator'
    },
    error: {
      error: 'Error',
      toMainPage: 'To the main page'
    },
    index: {
      noFrames: 'Your browser doesn`t support frames, which %s requires.<br>Please upgrade to something newer.'
    },
    thread: {
      replyToThread: 'Reply to thread #%s',
      modeReply: 'Mode: Reply',
      return: 'Return',
      bottom: 'Bottom',
      top: 'Top'
    }
  }
};
