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
        body: 'is the one line that lets an agent write straight through.',
      },
    ],
    showcase: {
      heading: 'No list of collections. No hand-written form. No list of block types.',
      lead: 'Add resource(Dish, …) to the application and it appears on the dashboard, in the sidebar, in the command palette and in the API Explorer, with no edit to Studio. Pages are a block tree, never HTML, with undo and redo. The theme is tokens, and nothing accepts CSS.',
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
      lead: 'Dependency direction is declared once and checked by pnpm boundaries. A new edge between packages needs a new ADR. The umbrella is the one package allowed to depend on everything, because it is the one nothing depends on.',
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
        body: '— єдиний рядок, що дозволяє агенту писати напряму.',
      },
    ],
    showcase: {
      heading: 'Без списку колекцій. Без написаних вручну форм. Без списку типів блоків.',
      lead: 'Додайте resource(Dish, …) до застосунку — і він з’явиться на дашборді, у сайдбарі, у палітрі команд та в API Explorer без жодної правки Studio. Сторінки — це дерево блоків, ніколи не HTML, з undo та redo. Тема — це токени, і ніщо не приймає CSS.',
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
      lead: 'Напрямок залежностей оголошено один раз і перевіряється pnpm boundaries. Нове ребро між пакетами потребує нового ADR. Парасолька — єдиний пакет, якому дозволено залежати від усього, бо від нього не залежить ніщо.',
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
        body: '— единственная строка, которая позволяет агенту писать напрямую.',
      },
    ],
    showcase: {
      heading: 'Без списка коллекций. Без написанных вручную форм. Без списка типов блоков.',
      lead: 'Добавьте resource(Dish, …) в приложение — и он появится на дашборде, в сайдбаре, в палитре команд и в API Explorer без единой правки Studio. Страницы — это дерево блоков, никогда не HTML, с undo и redo. Тема — это токены, и ничто не принимает CSS.',
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
      lead: 'Направление зависимостей объявлено один раз и проверяется pnpm boundaries. Новое ребро между пакетами требует нового ADR. Зонтик — единственный пакет, которому разрешено зависеть от всего, потому что от него не зависит ничто.',
    },
    start: {
      heading: 'Четыре команды. Один процесс.',
      lead: 'Работает на базе данных в памяти, поэтому ничего не нужно устанавливать и убирать.',
      actionLabel: 'Открыть на GitHub',
      secondaryLabel: 'Читать руководство',
    },
  },
} as const satisfies Readonly<Record<string, Copy>>
