/**
 * Every word on assemora.com, in the three languages it is written in (SPEC.md §131).
 *
 * It is here rather than inside `src/seed.ts` for one reason: the seed writes the
 * English page and then translates it, and a translation is the *same tree* with
 * different words in it — `pages.translate` copies the blocks, so a block keeps its
 * id and this file is what fills it in again. Splitting the copy out is what makes
 * "the same page, said differently" expressible as data.
 *
 * What is not here is anything that is not a word: the code samples, the pipeline
 * stages, the package names and the screenshots are the same in every language and
 * live in `src/seed.ts`.
 *
 * After the seed, this file is only the starting point. The page is content: an
 * editor changes a line in Studio and an agent proposes changing one, and neither
 * comes back here.
 */

export type Copy = {
  readonly hero: {
    readonly eyebrow: string
    readonly headlineTop: string
    readonly headlineBottom: string
    readonly lead: string
    readonly actionLabel: string
    readonly meta: readonly string[]
  }
  readonly proposals: {
    readonly title: string
    readonly ranStep: string
    readonly rolledStep: string
    readonly rolledEmphasis: string
    readonly diffLabel: string
    readonly removed: string
    readonly added: string
    readonly waiting: string
    readonly rejectLabel: string
    readonly applyLabel: string
    readonly appliedNote: string
    readonly rejectedNote: string
    readonly caption: string
  }
  readonly authors: {
    readonly eyebrow: string
    readonly heading: string
    readonly cards: readonly { readonly title: string; readonly body: string }[]
  }
  readonly declaration: {
    readonly eyebrow: string
    readonly heading: string
    readonly lead: string
    readonly results: readonly string[]
  }
  readonly mutation: {
    readonly eyebrow: string
    readonly heading: string
    readonly lead: string
  }
  readonly steps: readonly { readonly title: string; readonly body: string }[]
  readonly showcase: {
    readonly heading: string
    readonly lead: string
    readonly shots: readonly { readonly label: string; readonly caption: string }[]
  }
  readonly comparison: {
    readonly eyebrow: string
    readonly heading: string
    readonly lead: string
    readonly note: string
    readonly rows: readonly { readonly label: string; readonly cells: readonly string[] }[]
  }
  readonly packages: {
    readonly eyebrow: string
    readonly heading: string
    readonly lead: string
  }
  readonly start: {
    readonly heading: string
    readonly lead: string
    readonly actionLabel: string
    readonly secondaryLabel: string
  }
}

export const COPY = {
  en: {
    hero: {
      eyebrow: 'TypeScript framework · CMS · MCP server',
      headlineTop: 'An agent proposes.',
      headlineBottom: 'A person applies.',
      lead: "One application layer, reached three ways: developers in TypeScript, editors in Studio, AI agents over MCP. Every command is already a tool. An agent's write becomes a change set a person reviews — previewed by running the real command and rolling it back, so the preview cannot disagree with the write it predicts.",
      actionLabel: 'Read the guide',
      meta: ['Node 24 LTS', 'PostgreSQL', '24 packages', 'Apache-2.0'],
    },
    proposals: {
      title: 'Proposals',
      ranStep: '→ command runs for real, inside a transaction',
      rolledStep: '→ transaction rolled back.',
      rolledEmphasis: 'nothing has changed yet.',
      diffLabel: 'hero — subtitle changed',
      removed: '- Developers write TypeScript, people edit in Studio, agents propose changes.',
      added: '+ An agent proposes. A person applies. The preview is the write, rolled back.',
      waiting: 'waiting for a person',
      rejectLabel: 'Reject',
      applyLabel: 'Apply',
      appliedNote: '✓ applied by ada@assemora.dev · Home is now v12',
      rejectedNote: '✕ rejected. production untouched.',
      caption:
        'The line under a proposal is read off a real diff. There is no second code path, so it cannot lie.',
    },
    authors: {
      eyebrow: 'Three kinds of author',
      heading:
        'Developer, editor and agent reach the same bus. None of them has business logic of its own.',
      cards: [
        {
          title: 'Developer',
          body: 'An Eloquent-shaped data layer, typed routes and a CMS — without a Zod schema, a Drizzle table, a form, an OpenAPI path and an MCP tool that all describe the same field.',
        },
        {
          title: 'Editor',
          body: 'Studio: lists, forms, media, a page builder and a revision history. None of it is configured. Studio asks the Schema Registry what exists and renders that.',
        },
        {
          title: 'Agent',
          body: 'Every command and query is already a tool, generated from the registry — nobody maintains a list. Same validation, permissions, policies, field permissions and audit as a person.',
        },
      ],
    },
    declaration: {
      eyebrow: 'One declaration',
      heading: 'Declare a field once. Every row changes at once.',
      lead: 'One model and one resource become a migration, a record type, a typed query, REST, OpenAPI, a generated SDK, a Studio screen and an MCP tool. There is no second description of an article anywhere.',
      results: [
        'the migration that creates articles',
        'the record type, with published: boolean',
        "a typed query; where('publsihed', …) does not compile",
        'REST, filtered, searched and paginated',
        'the OpenAPI 3.1 document',
        'api.articles.list({ filters: { published: true } })',
        'the list, the form, the filter and the search box',
        'the MCP tool an agent calls, with the same schema',
      ],
    },
    mutation: {
      eyebrow: 'The mutation path',
      heading: 'There is exactly one way to change state, and every caller takes it.',
      lead: 'So "can an agent do this?" has the same answer as "can this person do this?", and nobody implements the question twice. The seven checks are not reimplemented for agents. A tool call is the same bus call Studio makes.',
    },
    steps: [
      {
        title: 'Run for real',
        body: 'A mutation tool executes the command inside a transaction — validation, permissions, policies and all.',
      },
      {
        title: 'Roll back',
        body: 'The transaction is rolled back. What is stored is the diff — a change set, under a title the agent chose.',
      },
      {
        title: 'A person decides',
        body: 'Production changes when someone applies it in Studio. A proposal against a page that has since changed is refused, not applied over the top.',
      },
      {
        title: 'Opt out, if you must',
        body: "`mcp: { mutations: 'direct' }` is the one line that lets an agent write straight through.",
      },
    ],
    showcase: {
      heading: 'No list of collections. No hand-written form. No list of block types.',
      lead: 'Add `resource(Dish, …)` to the application and it appears on the dashboard, in the sidebar, in the command palette and in the API Explorer, with no edit to Studio. Pages are a block tree, never HTML, with undo and redo. The theme is tokens, and nothing accepts CSS.',
      shots: [
        {
          label: 'Page builder',
          caption:
            'The block outline on the left, the site rendered by its own frontend in the centre, the selected block’s fields on the right.',
        },
        {
          label: 'Proposals',
          caption:
            'A change set an agent proposed under its own title, opened to one line per change, with Apply and Reject.',
        },
        {
          label: 'Dashboard',
          caption:
            'Every number and every card on the first screen is read from the Schema Registry.',
        },
        {
          label: 'Theme',
          caption: 'The theme as tokens, and the stylesheet they render to. Nothing accepts CSS.',
        },
      ],
    },
    comparison: {
      eyebrow: 'How it compares',
      heading: 'The difference is what a tool call does.',
      lead: "Payload, Strapi and Directus each ship an MCP server, and each one is a good piece of work. Theirs writes. Assemora's proposes. The rest of the table is where Assemora loses today, stated plainly.",
      note: "As of September 2026, read from each project's own documentation. If a cell is out of date, a pull request fixing it is welcome.",
      rows: [
        {
          label: "What an agent's write does",
          cells: [
            'Stores a change set a person applies; previewed by executing and rolling back',
            'Writes directly; access rules and hooks apply',
            'Writes directly; a draft where Draft & Publish is on, then a publish tool',
            "Writes directly through the user's permissions; delete protection is opt-in",
          ],
        },
        {
          label: 'Where the MCP tools come from',
          cells: [
            'Generated from the Schema Registry: one per command and query, nobody keeps a list',
            'Official plugin generates find, create, update, delete per collection',
            'Built in: list, get, create, update, delete, publish, unpublish per content type',
            'Official server',
          ],
        },
        {
          label: 'One schema declaration feeds',
          cells: [
            'Types, validation, database, Studio, OpenAPI, SDK and MCP',
            'Types, REST, GraphQL, admin',
            'Types, REST, GraphQL, admin',
            'Introspected from the database',
          ],
        },
        {
          label: 'Pages',
          cells: [
            'A block tree, never HTML, with undo and redo; the theme is tokens and nothing accepts CSS',
            'Blocks field with live preview',
            'Dynamic zones',
            'Not a page builder',
          ],
        },
        {
          label: 'Databases',
          cells: [
            'PostgreSQL only',
            'PostgreSQL, MongoDB, SQLite',
            'PostgreSQL, MySQL, MariaDB, SQLite',
            'PostgreSQL, MySQL, MariaDB, SQLite, MS SQL, Oracle, CockroachDB',
          ],
        },
        {
          label: 'GraphQL · Realtime',
          cells: ['No · No', 'Yes · No', 'Plugin · No', 'Yes · WebSockets and subscriptions'],
        },
        {
          label: 'License',
          cells: ['Apache-2.0', 'MIT', 'MIT', 'Source-available (MSCL)'],
        },
      ],
    },
    packages: {
      eyebrow: '24 packages',
      heading: 'Fixed boundaries, enforced in CI.',
      lead: 'Dependency direction is declared once and checked by `pnpm boundaries`. A new edge between packages needs a new ADR. The umbrella is the one package allowed to depend on everything, because it is the one nothing depends on.',
    },
    start: {
      heading: 'Four commands. One process.',
      lead: 'It runs on an in-memory database, so there is nothing to install and nothing to clean up.',
      actionLabel: 'View on GitHub',
      secondaryLabel: 'Read the guide',
    },
  },
  uk: {
    hero: {
      eyebrow: 'TypeScript-фреймворк · CMS · MCP-сервер',
      headlineTop: 'Агент пропонує.',
      headlineBottom: 'Людина застосовує.',
      lead: 'Один шар застосунку, три шляхи до нього: розробники через TypeScript, редактори через Studio, ШІ-агенти через MCP. Кожна команда вже є інструментом. Запис агента стає набором змін, який переглядає людина: він отриманий виконанням справжньої команди з відкатом, тож передперегляд не може розійтися із записом, який передбачає.',
      actionLabel: 'Читати посібник',
      meta: ['Node 24 LTS', 'PostgreSQL', '24 пакети', 'Apache-2.0'],
    },
    proposals: {
      title: 'Пропозиції',
      ranStep: '→ команда виконується по-справжньому, у транзакції',
      rolledStep: '→ транзакцію відкочено.',
      rolledEmphasis: 'нічого ще не змінилося.',
      diffLabel: 'hero — змінено підзаголовок',
      removed: '- Розробники пишуть TypeScript, люди редагують у Studio, агенти пропонують зміни.',
      added: '+ Агент пропонує. Людина застосовує. Передперегляд — це сам запис, відкочений.',
      waiting: 'чекає на людину',
      rejectLabel: 'Відхилити',
      applyLabel: 'Застосувати',
      appliedNote: '✓ застосовано ada@assemora.dev · Home тепер v12',
      rejectedNote: '✕ відхилено. продакшн не зачеплено.',
      caption:
        'Рядок під пропозицією читається зі справжнього диффу. Другого шляху в коді немає, тому він не може брехати.',
    },
    authors: {
      eyebrow: 'Три види авторів',
      heading:
        'Розробник, редактор і агент виходять на одну шину. Ні в кого з них немає власної бізнес-логіки.',
      cards: [
        {
          title: 'Розробник',
          body: 'Шар даних у дусі Eloquent, типізовані маршрути та CMS — без Zod-схеми, таблиці Drizzle, форми, шляху OpenAPI та MCP-інструмента, що всі описують одне й те саме поле.',
        },
        {
          title: 'Редактор',
          body: 'Studio: списки, форми, медіа, конструктор сторінок та історія ревізій. Нічого з цього не налаштовується. Studio запитує в Реєстрі схем, що існує, і рендерить це.',
        },
        {
          title: 'Агент',
          body: 'Кожна команда і запит уже є інструментом, згенерованим з реєстру — ніхто не веде список. Та сама валідація, дозволи, політики, польові дозволи та аудит, що й для людини.',
        },
      ],
    },
    declaration: {
      eyebrow: 'Одна декларація',
      heading: 'Оголосіть поле один раз. Усі рядки зміняться разом.',
      lead: 'Одна модель і один ресурс стають міграцією, типом запису, типізованим запитом, REST, OpenAPI, згенерованим SDK, екраном Studio та MCP-інструментом. Другого опису статті немає ніде.',
      results: [
        'міграція, що створює articles',
        'тип запису, з published: boolean',
        "типізований запит; where('publsihed', …) не компілюється",
        'REST — з фільтрами, пошуком і пагінацією',
        'документ OpenAPI 3.1',
        'api.articles.list({ filters: { published: true } })',
        'список, форма, фільтр і пошук',
        'MCP-інструмент, який викликає агент, з тією ж схемою',
      ],
    },
    mutation: {
      eyebrow: 'Шлях мутації',
      heading: 'Є рівно один спосіб змінити стан, і кожен викликач іде ним.',
      lead: 'Тож «чи може агент це зробити?» має ту саму відповідь, що й «чи може ця людина це зробити?», і ніхто не реалізує питання двічі. Сім перевірок не переписуються для агентів. Виклик інструмента — той самий виклик шини, що робить Studio.',
    },
    steps: [
      {
        title: 'Виконати по-справжньому',
        body: 'Мутуючий інструмент виконує команду у транзакції — з валідацією, дозволами, політиками, усім.',
      },
      {
        title: 'Відкотити',
        body: 'Транзакція відкочується. Зберігається дифф — набір змін під назвою, яку обрав агент.',
      },
      {
        title: 'Вирішує людина',
        body: 'Продакшн змінюється, коли хтось застосує це у Studio. Пропозиція до сторінки, що відтоді змінилася, відхиляється, а не накладається поверх.',
      },
      {
        title: 'Відмовитися, якщо конче треба',
        body: "`mcp: { mutations: 'direct' }` — єдиний рядок, що дозволяє агенту писати напряму.",
      },
    ],
    showcase: {
      heading: 'Без списку колекцій. Без написаних вручну форм. Без списку типів блоків.',
      lead: 'Додайте `resource(Dish, …)` до застосунку — і він з’явиться на дашборді, у сайдбарі, у палітрі команд та в API Explorer без жодної правки Studio. Сторінки — це дерево блоків, ніколи не HTML, з undo та redo. Тема — це токени, і ніщо не приймає CSS.',
      shots: [
        {
          label: 'Конструктор сторінок',
          caption:
            'Структура блоків зліва, сайт, відрендерений власним фронтендом, у центрі, поля обраного блоку справа.',
        },
        {
          label: 'Пропозиції',
          caption:
            'Набір змін, запропонований агентом під власною назвою, розкритий до одного рядка на зміну, з кнопками Застосувати і Відхилити.',
        },
        {
          label: 'Дашборд',
          caption: 'Кожне число і кожна картка на першому екрані читаються з Реєстру схем.',
        },
        {
          label: 'Тема',
          caption: 'Тема як токени і таблиця стилів, у яку вони рендеряться. Ніщо не приймає CSS.',
        },
      ],
    },
    comparison: {
      eyebrow: 'Порівняння',
      heading: 'Різниця в тому, що робить виклик інструмента.',
      lead: 'Payload, Strapi і Directus мають MCP-сервер, і кожен зроблений добре. Їхній — пише. Assemora — пропонує. Решта таблиці — де Assemora сьогодні програє, сказано прямо.',
      note: 'Станом на вересень 2026, за документацією кожного проєкту. Якщо клітинка застаріла — pull request із виправленням вітається.',
      rows: [
        {
          label: 'Що робить запис агента',
          cells: [
            'Зберігає набір змін, який застосовує людина; передперегляд — виконанням і відкатом',
            'Пише напряму; діють правила доступу та хуки',
            'Пише напряму; чернетка, якщо ввімкнено Draft & Publish, потім інструмент publish',
            'Пише напряму через дозволи користувача; захист від видалення — опційний',
          ],
        },
        {
          label: 'Звідки беруться MCP-інструменти',
          cells: [
            'Генеруються з Реєстру схем: по одному на команду і запит, список ніхто не веде',
            'Офіційний плагін генерує find, create, update, delete на колекцію',
            'Вбудовано: list, get, create, update, delete, publish, unpublish на тип контенту',
            'Офіційний сервер',
          ],
        },
        {
          label: 'Одна декларація схеми дає',
          cells: [
            'Типи, валідацію, БД, Studio, OpenAPI, SDK і MCP',
            'Типи, REST, GraphQL, адмінку',
            'Типи, REST, GraphQL, адмінку',
            'Інтроспекція з бази даних',
          ],
        },
        {
          label: 'Сторінки',
          cells: [
            'Дерево блоків, ніколи не HTML, з undo/redo; тема — токени, CSS не приймається',
            'Поле Blocks з живим передпереглядом',
            'Dynamic zones',
            'Не конструктор сторінок',
          ],
        },
        {
          label: 'Бази даних',
          cells: [
            'Лише PostgreSQL',
            'PostgreSQL, MongoDB, SQLite',
            'PostgreSQL, MySQL, MariaDB, SQLite',
            'PostgreSQL, MySQL, MariaDB, SQLite, MS SQL, Oracle, CockroachDB',
          ],
        },
        {
          label: 'GraphQL · Realtime',
          cells: ['Ні · Ні', 'Так · Ні', 'Плагін · Ні', 'Так · WebSockets і підписки'],
        },
        {
          label: 'Ліцензія',
          cells: ['Apache-2.0', 'MIT', 'MIT', 'Source-available (MSCL)'],
        },
      ],
    },
    packages: {
      eyebrow: '24 пакети',
      heading: 'Фіксовані межі, перевірені в CI.',
      lead: 'Напрямок залежностей оголошено один раз і перевіряється `pnpm boundaries`. Нове ребро між пакетами потребує нового ADR. Парасолька — єдиний пакет, якому дозволено залежати від усього, бо від нього не залежить ніщо.',
    },
    start: {
      heading: 'Чотири команди. Один процес.',
      lead: 'Працює на базі даних у пам’яті, тож нічого не треба встановлювати і прибирати.',
      actionLabel: 'Відкрити на GitHub',
      secondaryLabel: 'Читати посібник',
    },
  },
  ru: {
    hero: {
      eyebrow: 'TypeScript-фреймворк · CMS · MCP-сервер',
      headlineTop: 'Агент предлагает.',
      headlineBottom: 'Человек применяет.',
      lead: 'Один слой приложения, три пути к нему: разработчики через TypeScript, редакторы через Studio, ИИ-агенты через MCP. Каждая команда уже инструмент. Запись агента становится набором изменений, который проверяет человек: он получен выполнением настоящей команды с откатом, поэтому предпросмотр не может расходиться с записью, которую предсказывает.',
      actionLabel: 'Читать руководство',
      meta: ['Node 24 LTS', 'PostgreSQL', '24 пакета', 'Apache-2.0'],
    },
    proposals: {
      title: 'Предложения',
      ranStep: '→ команда выполняется по-настоящему, в транзакции',
      rolledStep: '→ транзакция откачена.',
      rolledEmphasis: 'ничего ещё не изменилось.',
      diffLabel: 'hero — изменён подзаголовок',
      removed:
        '- Разработчики пишут TypeScript, люди редактируют в Studio, агенты предлагают изменения.',
      added: '+ Агент предлагает. Человек применяет. Предпросмотр — это сама запись, откаченная.',
      waiting: 'ждёт человека',
      rejectLabel: 'Отклонить',
      applyLabel: 'Применить',
      appliedNote: '✓ применено ada@assemora.dev · Home теперь v12',
      rejectedNote: '✕ отклонено. продакшн не тронут.',
      caption:
        'Строка под предложением читается из настоящего диффа. Второго пути в коде нет, поэтому он не может врать.',
    },
    authors: {
      eyebrow: 'Три вида авторов',
      heading:
        'Разработчик, редактор и агент выходят на одну шину. Ни у кого из них нет собственной бизнес-логики.',
      cards: [
        {
          title: 'Разработчик',
          body: 'Слой данных в духе Eloquent, типизированные маршруты и CMS — без Zod-схемы, таблицы Drizzle, формы, пути OpenAPI и MCP-инструмента, которые все описывают одно и то же поле.',
        },
        {
          title: 'Редактор',
          body: 'Studio: списки, формы, медиа, конструктор страниц и история ревизий. Ничего из этого не настраивается. Studio спрашивает у Реестра схем, что существует, и рендерит это.',
        },
        {
          title: 'Агент',
          body: 'Каждая команда и запрос уже инструмент, сгенерированный из реестра — никто не ведёт список. Та же валидация, права, политики, права на поля и аудит, что и у человека.',
        },
      ],
    },
    declaration: {
      eyebrow: 'Одна декларация',
      heading: 'Объявите поле один раз. Все строки изменятся сразу.',
      lead: 'Одна модель и один ресурс становятся миграцией, типом записи, типизированным запросом, REST, OpenAPI, сгенерированным SDK, экраном Studio и MCP-инструментом. Второго описания статьи нет нигде.',
      results: [
        'миграция, создающая articles',
        'тип записи, с published: boolean',
        "типизированный запрос; where('publsihed', …) не компилируется",
        'REST — с фильтрами, поиском и пагинацией',
        'документ OpenAPI 3.1',
        'api.articles.list({ filters: { published: true } })',
        'список, форма, фильтр и поиск',
        'MCP-инструмент, который вызывает агент, с той же схемой',
      ],
    },
    mutation: {
      eyebrow: 'Путь мутации',
      heading: 'Есть ровно один способ изменить состояние, и каждый вызывающий идёт им.',
      lead: 'Поэтому «может ли агент это сделать?» имеет тот же ответ, что и «может ли этот человек это сделать?», и никто не реализует вопрос дважды. Семь проверок не переписываются для агентов. Вызов инструмента — тот же вызов шины, что делает Studio.',
    },
    steps: [
      {
        title: 'Выполнить по-настоящему',
        body: 'Мутирующий инструмент выполняет команду в транзакции — с валидацией, правами, политиками, всем.',
      },
      {
        title: 'Откатить',
        body: 'Транзакция откатывается. Сохраняется дифф — набор изменений под названием, которое выбрал агент.',
      },
      {
        title: 'Решает человек',
        body: 'Продакшн меняется, когда кто-то применит это в Studio. Предложение к странице, которая с тех пор изменилась, отклоняется, а не накладывается поверх.',
      },
      {
        title: 'Отказаться, если очень нужно',
        body: "`mcp: { mutations: 'direct' }` — единственная строка, которая позволяет агенту писать напрямую.",
      },
    ],
    showcase: {
      heading: 'Без списка коллекций. Без написанных вручную форм. Без списка типов блоков.',
      lead: 'Добавьте `resource(Dish, …)` в приложение — и он появится на дашборде, в сайдбаре, в палитре команд и в API Explorer без единой правки Studio. Страницы — это дерево блоков, никогда не HTML, с undo и redo. Тема — это токены, и ничто не принимает CSS.',
      shots: [
        {
          label: 'Конструктор страниц',
          caption:
            'Структура блоков слева, сайт, отрендеренный собственным фронтендом, в центре, поля выбранного блока справа.',
        },
        {
          label: 'Предложения',
          caption:
            'Набор изменений, предложенный агентом под собственным названием, раскрытый до одной строки на изменение, с кнопками Применить и Отклонить.',
        },
        {
          label: 'Дашборд',
          caption: 'Каждое число и каждая карточка на первом экране читаются из Реестра схем.',
        },
        {
          label: 'Тема',
          caption:
            'Тема как токены и таблица стилей, в которую они рендерятся. Ничто не принимает CSS.',
        },
      ],
    },
    comparison: {
      eyebrow: 'Сравнение',
      heading: 'Разница в том, что делает вызов инструмента.',
      lead: 'У Payload, Strapi и Directus есть MCP-сервер, и каждый сделан хорошо. Их — пишет. Assemora — предлагает. Остальная таблица — где Assemora сегодня проигрывает, сказано прямо.',
      note: 'По состоянию на сентябрь 2026, по документации каждого проекта. Если ячейка устарела — pull request с исправлением приветствуется.',
      rows: [
        {
          label: 'Что делает запись агента',
          cells: [
            'Сохраняет набор изменений, который применяет человек; предпросмотр — выполнением и откатом',
            'Пишет напрямую; действуют правила доступа и хуки',
            'Пишет напрямую; черновик, если включён Draft & Publish, затем инструмент publish',
            'Пишет напрямую через права пользователя; защита от удаления — опциональна',
          ],
        },
        {
          label: 'Откуда берутся MCP-инструменты',
          cells: [
            'Генерируются из Реестра схем: по одному на команду и запрос, список никто не ведёт',
            'Официальный плагин генерирует find, create, update, delete на коллекцию',
            'Встроено: list, get, create, update, delete, publish, unpublish на тип контента',
            'Официальный сервер',
          ],
        },
        {
          label: 'Одна декларация схемы даёт',
          cells: [
            'Типы, валидацию, БД, Studio, OpenAPI, SDK и MCP',
            'Типы, REST, GraphQL, админку',
            'Типы, REST, GraphQL, админку',
            'Интроспекция из базы данных',
          ],
        },
        {
          label: 'Страницы',
          cells: [
            'Дерево блоков, никогда не HTML, с undo/redo; тема — токены, CSS не принимается',
            'Поле Blocks с живым предпросмотром',
            'Dynamic zones',
            'Не конструктор страниц',
          ],
        },
        {
          label: 'Базы данных',
          cells: [
            'Только PostgreSQL',
            'PostgreSQL, MongoDB, SQLite',
            'PostgreSQL, MySQL, MariaDB, SQLite',
            'PostgreSQL, MySQL, MariaDB, SQLite, MS SQL, Oracle, CockroachDB',
          ],
        },
        {
          label: 'GraphQL · Realtime',
          cells: ['Нет · Нет', 'Да · Нет', 'Плагин · Нет', 'Да · WebSockets и подписки'],
        },
        {
          label: 'Лицензия',
          cells: ['Apache-2.0', 'MIT', 'MIT', 'Source-available (MSCL)'],
        },
      ],
    },
    packages: {
      eyebrow: '24 пакета',
      heading: 'Фиксированные границы, проверенные в CI.',
      lead: 'Направление зависимостей объявлено один раз и проверяется `pnpm boundaries`. Новое ребро между пакетами требует нового ADR. Зонтик — единственный пакет, которому разрешено зависеть от всего, потому что от него не зависит ничто.',
    },
    start: {
      heading: 'Четыре команды. Один процесс.',
      lead: 'Работает на базе данных в памяти, поэтому ничего не нужно устанавливать и убирать.',
      actionLabel: 'Открыть на GitHub',
      secondaryLabel: 'Читать руководство',
    },
  },
  de: {
    hero: {
      eyebrow: 'TypeScript-Framework · CMS · MCP-Server',
      headlineTop: 'Ein Agent schlägt vor.',
      headlineBottom: 'Ein Mensch wendet an.',
      lead: 'Eine Anwendungsschicht, auf drei Wegen erreichbar: Entwickler über TypeScript, Redakteure über Studio, KI-Agenten über MCP. Jeder Befehl ist bereits ein Werkzeug. Was ein Agent schreibt, wird zu einem Änderungssatz, den ein Mensch prüft — erzeugt, indem der echte Befehl ausgeführt und zurückgerollt wird. Die Vorschau kann dem Schreibvorgang, den sie vorhersagt, also nicht widersprechen.',
      actionLabel: 'Zum Handbuch',
      meta: ['Node 24 LTS', 'PostgreSQL', '24 Pakete', 'Apache-2.0'],
    },
    proposals: {
      title: 'Vorschläge',
      ranStep: '→ Befehl läuft wirklich, in einer Transaktion',
      rolledStep: '→ Transaktion zurückgerollt.',
      rolledEmphasis: 'noch hat sich nichts geändert.',
      diffLabel: 'hero — Untertitel geändert',
      removed:
        '- Entwickler schreiben TypeScript, Menschen redigieren in Studio, Agenten schlagen Änderungen vor.',
      added:
        '+ Ein Agent schlägt vor. Ein Mensch wendet an. Die Vorschau ist der Schreibvorgang, zurückgerollt.',
      waiting: 'wartet auf einen Menschen',
      rejectLabel: 'Ablehnen',
      applyLabel: 'Anwenden',
      appliedNote: '✓ angewendet von ada@assemora.dev · Home ist jetzt v12',
      rejectedNote: '✕ abgelehnt. Produktion unberührt.',
      caption:
        'Die Zeile unter einem Vorschlag wird aus einem echten Diff gelesen. Es gibt keinen zweiten Codepfad, also kann sie nicht lügen.',
    },
    authors: {
      eyebrow: 'Drei Arten von Autor',
      heading:
        'Entwickler, Redakteur und Agent erreichen denselben Bus. Keiner von ihnen hat eigene Geschäftslogik.',
      cards: [
        {
          title: 'Entwickler',
          body: 'Eine Datenschicht in Eloquent-Form, typisierte Routen und ein CMS — ohne ein Zod-Schema, eine Drizzle-Tabelle, ein Formular, einen OpenAPI-Pfad und ein MCP-Werkzeug, die alle dasselbe Feld beschreiben.',
        },
        {
          title: 'Redakteur',
          body: 'Studio: Listen, Formulare, Medien, ein Seitenbaukasten und eine Revisionshistorie. Nichts davon wird konfiguriert. Studio fragt die Schema-Registry, was existiert, und stellt genau das dar.',
        },
        {
          title: 'Agent',
          body: 'Jeder Befehl und jede Abfrage ist bereits ein Werkzeug, erzeugt aus der Registry — niemand pflegt eine Liste. Dieselbe Validierung, dieselben Rechte, Richtlinien, Feldrechte und Protokollierung wie bei einem Menschen.',
        },
      ],
    },
    declaration: {
      eyebrow: 'Eine Deklaration',
      heading: 'Ein Feld einmal deklarieren. Jede Zeile ändert sich mit.',
      lead: 'Ein Modell und eine Ressource werden zu einer Migration, einem Datensatztyp, einer typisierten Abfrage, zu REST, OpenAPI, einem erzeugten SDK, einem Studio-Bildschirm und einem MCP-Werkzeug. Nirgends steht eine zweite Beschreibung eines Artikels.',
      results: [
        'die Migration, die articles anlegt',
        'der Datensatztyp, mit published: boolean',
        "eine typisierte Abfrage; where('publsihed', …) kompiliert nicht",
        'REST, gefiltert, durchsucht und seitenweise',
        'das OpenAPI-3.1-Dokument',
        'api.articles.list({ filters: { published: true } })',
        'die Liste, das Formular, der Filter und die Suche',
        'das MCP-Werkzeug, das ein Agent aufruft, mit demselben Schema',
      ],
    },
    mutation: {
      eyebrow: 'Der Mutationspfad',
      heading: 'Es gibt genau einen Weg, Zustand zu ändern, und jeder Aufrufer nimmt ihn.',
      lead: '„Darf ein Agent das?“ hat damit dieselbe Antwort wie „darf dieser Mensch das?“, und niemand implementiert die Frage zweimal. Die sieben Prüfungen werden für Agenten nicht neu geschrieben. Ein Werkzeugaufruf ist derselbe Bus-Aufruf, den Studio macht.',
    },
    steps: [
      {
        title: 'Wirklich ausführen',
        body: 'Ein mutierendes Werkzeug führt den Befehl in einer Transaktion aus — mit Validierung, Rechten, Richtlinien, allem.',
      },
      {
        title: 'Zurückrollen',
        body: 'Die Transaktion wird zurückgerollt. Gespeichert wird das Diff — ein Änderungssatz unter einem Titel, den der Agent gewählt hat.',
      },
      {
        title: 'Ein Mensch entscheidet',
        body: 'Die Produktion ändert sich, wenn jemand es in Studio anwendet. Ein Vorschlag auf eine seither geänderte Seite wird abgelehnt, nicht darübergelegt.',
      },
      {
        title: 'Abschalten, wenn es sein muss',
        body: "`mcp: { mutations: 'direct' }` ist die eine Zeile, die einen Agenten direkt schreiben lässt.",
      },
    ],
    showcase: {
      heading:
        'Keine Liste von Kollektionen. Kein handgeschriebenes Formular. Keine Liste von Blocktypen.',
      lead: 'Füge `resource(Dish, …)` der Anwendung hinzu, und es erscheint im Dashboard, in der Seitenleiste, in der Befehlspalette und im API-Explorer — ohne eine einzige Änderung an Studio. Seiten sind ein Blockbaum, niemals HTML, mit Rückgängig und Wiederholen. Das Theme sind Tokens, und nichts nimmt CSS entgegen.',
      shots: [
        {
          label: 'Seitenbaukasten',
          caption:
            'Die Blockgliederung links, die Website vom eigenen Frontend gerendert in der Mitte, die Felder des gewählten Blocks rechts.',
        },
        {
          label: 'Vorschläge',
          caption:
            'Ein Änderungssatz, den ein Agent unter eigenem Titel vorgeschlagen hat, aufgeklappt zu einer Zeile pro Änderung, mit Anwenden und Ablehnen.',
        },
        {
          label: 'Dashboard',
          caption:
            'Jede Zahl und jede Karte auf dem ersten Bildschirm wird aus der Schema-Registry gelesen.',
        },
        {
          label: 'Theme',
          caption:
            'Das Theme als Tokens und das Stylesheet, zu dem sie werden. Nichts nimmt CSS entgegen.',
        },
      ],
    },
    comparison: {
      eyebrow: 'Im Vergleich',
      heading: 'Der Unterschied ist, was ein Werkzeugaufruf tut.',
      lead: 'Payload, Strapi und Directus liefern jeweils einen MCP-Server, und jeder davon ist gute Arbeit. Ihrer schreibt. Assemoras schlägt vor. Der Rest der Tabelle ist, wo Assemora heute verliert, offen gesagt.',
      note: 'Stand September 2026, gelesen in der Dokumentation des jeweiligen Projekts. Ist eine Zelle veraltet, ist ein Pull Request willkommen.',
      rows: [
        {
          label: 'Was der Schreibzugriff eines Agenten tut',
          cells: [
            'Legt einen Änderungssatz an, den ein Mensch anwendet; Vorschau durch Ausführen und Zurückrollen',
            'Schreibt direkt; Zugriffsregeln und Hooks greifen',
            'Schreibt direkt; ein Entwurf, wo Draft & Publish an ist, dann ein publish-Werkzeug',
            'Schreibt direkt mit den Rechten des Benutzers; Löschschutz ist optional',
          ],
        },
        {
          label: 'Woher die MCP-Werkzeuge kommen',
          cells: [
            'Erzeugt aus der Schema-Registry: eines je Befehl und Abfrage, niemand führt eine Liste',
            'Offizielles Plugin erzeugt find, create, update, delete je Kollektion',
            'Eingebaut: list, get, create, update, delete, publish, unpublish je Inhaltstyp',
            'Offizieller Server',
          ],
        },
        {
          label: 'Eine Schema-Deklaration speist',
          cells: [
            'Typen, Validierung, Datenbank, Studio, OpenAPI, SDK und MCP',
            'Typen, REST, GraphQL, Admin',
            'Typen, REST, GraphQL, Admin',
            'Aus der Datenbank ausgelesen',
          ],
        },
        {
          label: 'Seiten',
          cells: [
            'Ein Blockbaum, niemals HTML, mit Rückgängig und Wiederholen; das Theme sind Tokens und nichts nimmt CSS entgegen',
            'Blocks-Feld mit Live-Vorschau',
            'Dynamische Zonen',
            'Kein Seitenbaukasten',
          ],
        },
        {
          label: 'Datenbanken',
          cells: [
            'Nur PostgreSQL',
            'PostgreSQL, MongoDB, SQLite',
            'PostgreSQL, MySQL, MariaDB, SQLite',
            'PostgreSQL, MySQL, MariaDB, SQLite, MS SQL, Oracle, CockroachDB',
          ],
        },
        {
          label: 'GraphQL · Realtime',
          cells: ['Nein · Nein', 'Ja · Nein', 'Plugin · Nein', 'Ja · WebSockets und Subscriptions'],
        },
        {
          label: 'Lizenz',
          cells: ['Apache-2.0', 'MIT', 'MIT', 'Quelloffen einsehbar (MSCL)'],
        },
      ],
    },
    packages: {
      eyebrow: '24 Pakete',
      heading: 'Feste Grenzen, in der CI geprüft.',
      lead: 'Die Abhängigkeitsrichtung wird einmal deklariert und von `pnpm boundaries` geprüft. Eine neue Kante zwischen Paketen braucht ein neues ADR. Das Dachpaket ist das einzige, das von allem abhängen darf, weil nichts von ihm abhängt.',
    },
    start: {
      heading: 'Vier Befehle. Ein Prozess.',
      lead: 'Es läuft auf einer Datenbank im Arbeitsspeicher, es gibt also nichts zu installieren und nichts aufzuräumen.',
      actionLabel: 'Auf GitHub ansehen',
      secondaryLabel: 'Zum Handbuch',
    },
  },
  es: {
    hero: {
      eyebrow: 'Framework TypeScript · CMS · servidor MCP',
      headlineTop: 'Un agente propone.',
      headlineBottom: 'Una persona aplica.',
      lead: 'Una sola capa de aplicación, alcanzable de tres maneras: los desarrolladores en TypeScript, los editores en Studio, los agentes de IA por MCP. Cada comando ya es una herramienta. Lo que un agente escribe se convierte en un conjunto de cambios que una persona revisa — obtenido ejecutando el comando real y deshaciéndolo, de modo que la vista previa no puede contradecir la escritura que predice.',
      actionLabel: 'Leer la guía',
      meta: ['Node 24 LTS', 'PostgreSQL', '24 paquetes', 'Apache-2.0'],
    },
    proposals: {
      title: 'Propuestas',
      ranStep: '→ el comando se ejecuta de verdad, dentro de una transacción',
      rolledStep: '→ transacción deshecha.',
      rolledEmphasis: 'todavía no ha cambiado nada.',
      diffLabel: 'hero — subtítulo modificado',
      removed:
        '- Los desarrolladores escriben TypeScript, las personas editan en Studio, los agentes proponen cambios.',
      added: '+ Un agente propone. Una persona aplica. La vista previa es la escritura, deshecha.',
      waiting: 'esperando a una persona',
      rejectLabel: 'Rechazar',
      applyLabel: 'Aplicar',
      appliedNote: '✓ aplicado por ada@assemora.dev · Home ahora es v12',
      rejectedNote: '✕ rechazado. producción intacta.',
      caption:
        'La línea bajo una propuesta se lee de un diff real. No hay un segundo camino en el código, así que no puede mentir.',
    },
    authors: {
      eyebrow: 'Tres clases de autor',
      heading:
        'Desarrollador, editor y agente llegan al mismo bus. Ninguno tiene lógica de negocio propia.',
      cards: [
        {
          title: 'Desarrollador',
          body: 'Una capa de datos al estilo de Eloquent, rutas tipadas y un CMS — sin un esquema de Zod, una tabla de Drizzle, un formulario, una ruta de OpenAPI y una herramienta MCP que describan todos el mismo campo.',
        },
        {
          title: 'Editor',
          body: 'Studio: listas, formularios, medios, un constructor de páginas y un historial de revisiones. Nada de eso se configura. Studio pregunta al Registro de Esquemas qué existe y dibuja eso.',
        },
        {
          title: 'Agente',
          body: 'Cada comando y cada consulta ya es una herramienta, generada desde el registro — nadie mantiene una lista. La misma validación, permisos, políticas, permisos por campo y auditoría que para una persona.',
        },
      ],
    },
    declaration: {
      eyebrow: 'Una declaración',
      heading: 'Declara un campo una vez. Cada fila cambia con él.',
      lead: 'Un modelo y un recurso se convierten en una migración, un tipo de registro, una consulta tipada, REST, OpenAPI, un SDK generado, una pantalla de Studio y una herramienta MCP. No hay una segunda descripción de un artículo en ninguna parte.',
      results: [
        'la migración que crea articles',
        'el tipo del registro, con published: boolean',
        "una consulta tipada; where('publsihed', …) no compila",
        'REST, con filtros, búsqueda y paginación',
        'el documento OpenAPI 3.1',
        'api.articles.list({ filters: { published: true } })',
        'la lista, el formulario, el filtro y el buscador',
        'la herramienta MCP que llama un agente, con el mismo esquema',
      ],
    },
    mutation: {
      eyebrow: 'El camino de la mutación',
      heading: 'Hay exactamente una forma de cambiar el estado, y todo el mundo pasa por ella.',
      lead: 'Así «¿puede un agente hacer esto?» tiene la misma respuesta que «¿puede esta persona hacer esto?», y nadie implementa la pregunta dos veces. Las siete comprobaciones no se reescriben para los agentes. Una llamada a una herramienta es la misma llamada al bus que hace Studio.',
    },
    steps: [
      {
        title: 'Ejecutar de verdad',
        body: 'Una herramienta que muta ejecuta el comando dentro de una transacción — con validación, permisos, políticas y todo lo demás.',
      },
      {
        title: 'Deshacer',
        body: 'La transacción se deshace. Lo que se guarda es el diff — un conjunto de cambios, bajo un título que eligió el agente.',
      },
      {
        title: 'Decide una persona',
        body: 'Producción cambia cuando alguien lo aplica en Studio. Una propuesta contra una página que ha cambiado desde entonces se rechaza, no se escribe encima.',
      },
      {
        title: 'Desactivarlo, si hace falta',
        body: "`mcp: { mutations: 'direct' }` es la única línea que deja a un agente escribir directamente.",
      },
    ],
    showcase: {
      heading:
        'Sin lista de colecciones. Sin formularios escritos a mano. Sin lista de tipos de bloque.',
      lead: 'Añade `resource(Dish, …)` a la aplicación y aparece en el panel, en la barra lateral, en la paleta de comandos y en el Explorador de API, sin tocar Studio. Las páginas son un árbol de bloques, nunca HTML, con deshacer y rehacer. El tema son tokens, y nada acepta CSS.',
      shots: [
        {
          label: 'Constructor de páginas',
          caption:
            'El esquema de bloques a la izquierda, el sitio dibujado por su propio frontend en el centro, los campos del bloque elegido a la derecha.',
        },
        {
          label: 'Propuestas',
          caption:
            'Un conjunto de cambios que un agente propuso bajo su propio título, abierto a una línea por cambio, con Aplicar y Rechazar.',
        },
        {
          label: 'Panel',
          caption:
            'Cada número y cada tarjeta de la primera pantalla se leen del Registro de Esquemas.',
        },
        {
          label: 'Tema',
          caption:
            'El tema como tokens y la hoja de estilos en que se convierten. Nada acepta CSS.',
        },
      ],
    },
    comparison: {
      eyebrow: 'Comparación',
      heading: 'La diferencia está en lo que hace una llamada a una herramienta.',
      lead: 'Payload, Strapi y Directus tienen cada uno un servidor MCP, y los tres están bien hechos. El suyo escribe. El de Assemora propone. El resto de la tabla es donde Assemora pierde hoy, dicho sin rodeos.',
      note: 'A septiembre de 2026, leído en la documentación de cada proyecto. Si una celda está desactualizada, un pull request que la corrija es bienvenido.',
      rows: [
        {
          label: 'Qué hace la escritura de un agente',
          cells: [
            'Guarda un conjunto de cambios que una persona aplica; previsto ejecutando y deshaciendo',
            'Escribe directamente; se aplican reglas de acceso y hooks',
            'Escribe directamente; un borrador donde Draft & Publish está activo, y luego una herramienta publish',
            'Escribe directamente con los permisos del usuario; la protección contra borrado es opcional',
          ],
        },
        {
          label: 'De dónde salen las herramientas MCP',
          cells: [
            'Generadas desde el Registro de Esquemas: una por comando y consulta, nadie mantiene una lista',
            'Un plugin oficial genera find, create, update y delete por colección',
            'Incorporadas: list, get, create, update, delete, publish, unpublish por tipo de contenido',
            'Servidor oficial',
          ],
        },
        {
          label: 'Una declaración de esquema alimenta',
          cells: [
            'Tipos, validación, base de datos, Studio, OpenAPI, SDK y MCP',
            'Tipos, REST, GraphQL, admin',
            'Tipos, REST, GraphQL, admin',
            'Se deduce de la base de datos',
          ],
        },
        {
          label: 'Páginas',
          cells: [
            'Un árbol de bloques, nunca HTML, con deshacer y rehacer; el tema son tokens y nada acepta CSS',
            'Campo de bloques con vista previa en vivo',
            'Zonas dinámicas',
            'No es un constructor de páginas',
          ],
        },
        {
          label: 'Bases de datos',
          cells: [
            'Solo PostgreSQL',
            'PostgreSQL, MongoDB, SQLite',
            'PostgreSQL, MySQL, MariaDB, SQLite',
            'PostgreSQL, MySQL, MariaDB, SQLite, MS SQL, Oracle, CockroachDB',
          ],
        },
        {
          label: 'GraphQL · Tiempo real',
          cells: ['No · No', 'Sí · No', 'Plugin · No', 'Sí · WebSockets y suscripciones'],
        },
        {
          label: 'Licencia',
          cells: ['Apache-2.0', 'MIT', 'MIT', 'Código a la vista (MSCL)'],
        },
      ],
    },
    packages: {
      eyebrow: '24 paquetes',
      heading: 'Fronteras fijas, comprobadas en CI.',
      lead: 'La dirección de las dependencias se declara una vez y la comprueba `pnpm boundaries`. Una nueva arista entre paquetes necesita un ADR nuevo. El paquete paraguas es el único al que se le permite depender de todo, porque es aquel del que no depende nada.',
    },
    start: {
      heading: 'Cuatro comandos. Un proceso.',
      lead: 'Funciona sobre una base de datos en memoria, así que no hay nada que instalar ni nada que limpiar después.',
      actionLabel: 'Ver en GitHub',
      secondaryLabel: 'Leer la guía',
    },
  },
  fr: {
    hero: {
      eyebrow: 'Framework TypeScript · CMS · serveur MCP',
      headlineTop: 'Un agent propose.',
      headlineBottom: 'Une personne applique.',
      lead: "Une seule couche applicative, atteinte de trois façons : les développeurs en TypeScript, les éditeurs dans Studio, les agents IA via MCP. Chaque commande est déjà un outil. Ce qu'un agent écrit devient un ensemble de modifications qu'une personne relit — obtenu en exécutant la vraie commande puis en l'annulant, si bien que l'aperçu ne peut pas contredire l'écriture qu'il prédit.",
      actionLabel: 'Lire le guide',
      meta: ['Node 24 LTS', 'PostgreSQL', '24 paquets', 'Apache-2.0'],
    },
    proposals: {
      title: 'Propositions',
      ranStep: "→ la commande s'exécute pour de vrai, dans une transaction",
      rolledStep: '→ transaction annulée.',
      rolledEmphasis: "rien n'a encore changé.",
      diffLabel: 'hero — sous-titre modifié',
      removed:
        '- Les développeurs écrivent du TypeScript, les personnes éditent dans Studio, les agents proposent des modifications.',
      added: "+ Un agent propose. Une personne applique. L'aperçu est l'écriture, annulée.",
      waiting: "en attente d'une personne",
      rejectLabel: 'Refuser',
      applyLabel: 'Appliquer',
      appliedNote: '✓ appliqué par ada@assemora.dev · Home est maintenant en v12',
      rejectedNote: '✕ refusé. production intacte.',
      caption:
        "La ligne sous une proposition est lue d'un vrai diff. Il n'y a pas de second chemin dans le code, elle ne peut donc pas mentir.",
    },
    authors: {
      eyebrow: "Trois sortes d'auteur",
      heading:
        "Développeur, éditeur et agent atteignent le même bus. Aucun d'eux n'a de logique métier qui lui soit propre.",
      cards: [
        {
          title: 'Développeur',
          body: "Une couche de données à la façon d'Eloquent, des routes typées et un CMS — sans un schéma Zod, une table Drizzle, un formulaire, un chemin OpenAPI et un outil MCP qui décrivent tous le même champ.",
        },
        {
          title: 'Éditeur',
          body: 'Studio : listes, formulaires, médias, un constructeur de pages et un historique des révisions. Rien de tout cela ne se configure. Studio demande au Registre de schémas ce qui existe, et affiche cela.',
        },
        {
          title: 'Agent',
          body: 'Chaque commande et chaque requête est déjà un outil, engendré depuis le registre — personne ne tient de liste. Mêmes validations, mêmes droits, mêmes politiques, mêmes droits par champ et même journalisation que pour une personne.',
        },
      ],
    },
    declaration: {
      eyebrow: 'Une déclaration',
      heading: 'Déclarez un champ une fois. Chaque ligne change avec lui.',
      lead: "Un modèle et une ressource deviennent une migration, un type d'enregistrement, une requête typée, REST, OpenAPI, un SDK engendré, un écran de Studio et un outil MCP. Il n'existe nulle part une seconde description d'un article.",
      results: [
        'la migration qui crée articles',
        "le type de l'enregistrement, avec published: boolean",
        "une requête typée ; where('publsihed', …) ne compile pas",
        'REST, filtré, cherché et paginé',
        'le document OpenAPI 3.1',
        'api.articles.list({ filters: { published: true } })',
        'la liste, le formulaire, le filtre et la recherche',
        "l'outil MCP qu'un agent appelle, avec le même schéma",
      ],
    },
    mutation: {
      eyebrow: 'Le chemin de la mutation',
      heading: "Il y a exactement une façon de changer l'état, et tout appelant l'emprunte.",
      lead: "Ainsi « un agent peut-il faire ceci ? » a la même réponse que « cette personne peut-elle faire ceci ? », et personne n'implémente la question deux fois. Les sept contrôles ne sont pas réécrits pour les agents. Un appel d'outil est le même appel au bus que fait Studio.",
    },
    steps: [
      {
        title: 'Exécuter pour de vrai',
        body: 'Un outil qui modifie exécute la commande dans une transaction — validation, droits, politiques, tout compris.',
      },
      {
        title: 'Annuler',
        body: "La transaction est annulée. Ce qui est enregistré, c'est le diff — un ensemble de modifications, sous un titre choisi par l'agent.",
      },
      {
        title: 'Une personne décide',
        body: "La production change quand quelqu'un l'applique dans Studio. Une proposition portant sur une page modifiée depuis est refusée, et non écrite par-dessus.",
      },
      {
        title: "S'en passer, s'il le faut",
        body: "`mcp: { mutations: 'direct' }` est la seule ligne qui laisse un agent écrire directement.",
      },
    ],
    showcase: {
      heading:
        'Aucune liste de collections. Aucun formulaire écrit à la main. Aucune liste de types de blocs.',
      lead: "Ajoutez `resource(Dish, …)` à l'application et cela apparaît sur le tableau de bord, dans la barre latérale, dans la palette de commandes et dans l'explorateur d'API, sans toucher à Studio. Les pages sont un arbre de blocs, jamais du HTML, avec annuler et rétablir. Le thème, ce sont des jetons, et rien n'accepte de CSS.",
      shots: [
        {
          label: 'Constructeur de pages',
          caption:
            'Le plan des blocs à gauche, le site rendu par son propre frontend au centre, les champs du bloc choisi à droite.',
        },
        {
          label: 'Propositions',
          caption:
            'Un ensemble de modifications proposé par un agent sous son propre titre, déplié à une ligne par modification, avec Appliquer et Refuser.',
        },
        {
          label: 'Tableau de bord',
          caption:
            'Chaque nombre et chaque carte du premier écran sont lus dans le Registre de schémas.',
        },
        {
          label: 'Thème',
          caption:
            "Le thème comme jetons, et la feuille de style qu'ils produisent. Rien n'accepte de CSS.",
        },
      ],
    },
    comparison: {
      eyebrow: 'Comparaison',
      heading: "La différence tient à ce que fait un appel d'outil.",
      lead: "Payload, Strapi et Directus livrent chacun un serveur MCP, et chacun est du bon travail. Le leur écrit. Celui d'Assemora propose. Le reste du tableau, c'est là où Assemora perd aujourd'hui, dit franchement.",
      note: "En septembre 2026, d'après la documentation de chaque projet. Si une case est périmée, une pull request qui la corrige est la bienvenue.",
      rows: [
        {
          label: "Ce que fait l'écriture d'un agent",
          cells: [
            "Enregistre un ensemble de modifications qu'une personne applique ; prévu en exécutant puis en annulant",
            "Écrit directement ; les règles d'accès et les hooks s'appliquent",
            'Écrit directement ; un brouillon là où Draft & Publish est actif, puis un outil publish',
            "Écrit directement avec les droits de l'utilisateur ; la protection contre la suppression est optionnelle",
          ],
        },
        {
          label: "D'où viennent les outils MCP",
          cells: [
            'Engendrés depuis le Registre de schémas : un par commande et par requête, personne ne tient de liste',
            'Un plugin officiel engendre find, create, update, delete par collection',
            'Intégrés : list, get, create, update, delete, publish, unpublish par type de contenu',
            'Serveur officiel',
          ],
        },
        {
          label: 'Une déclaration de schéma alimente',
          cells: [
            'Types, validation, base de données, Studio, OpenAPI, SDK et MCP',
            'Types, REST, GraphQL, admin',
            'Types, REST, GraphQL, admin',
            'Déduit de la base de données',
          ],
        },
        {
          label: 'Pages',
          cells: [
            "Un arbre de blocs, jamais du HTML, avec annuler et rétablir ; le thème est en jetons et rien n'accepte de CSS",
            'Champ de blocs avec aperçu en direct',
            'Zones dynamiques',
            'Pas un constructeur de pages',
          ],
        },
        {
          label: 'Bases de données',
          cells: [
            'PostgreSQL uniquement',
            'PostgreSQL, MongoDB, SQLite',
            'PostgreSQL, MySQL, MariaDB, SQLite',
            'PostgreSQL, MySQL, MariaDB, SQLite, MS SQL, Oracle, CockroachDB',
          ],
        },
        {
          label: 'GraphQL · Temps réel',
          cells: ['Non · Non', 'Oui · Non', 'Plugin · Non', 'Oui · WebSockets et souscriptions'],
        },
        {
          label: 'Licence',
          cells: ['Apache-2.0', 'MIT', 'MIT', 'Source consultable (MSCL)'],
        },
      ],
    },
    packages: {
      eyebrow: '24 paquets',
      heading: 'Des frontières fixes, vérifiées en CI.',
      lead: "Le sens des dépendances est déclaré une fois et vérifié par `pnpm boundaries`. Une nouvelle arête entre paquets demande un nouvel ADR. Le paquet parapluie est le seul autorisé à dépendre de tout, parce que c'est celui dont rien ne dépend.",
    },
    start: {
      heading: 'Quatre commandes. Un processus.',
      lead: "Cela tourne sur une base de données en mémoire : il n'y a donc rien à installer et rien à nettoyer.",
      actionLabel: 'Voir sur GitHub',
      secondaryLabel: 'Lire le guide',
    },
  },
} as const satisfies Readonly<Record<string, Copy>>
