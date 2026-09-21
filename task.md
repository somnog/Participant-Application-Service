Restructure the existing SomNOG EMS project to match the Participant & Application Service architecture.

Important:
- Do not delete working business logic.
- Do not duplicate modules.
- Keep existing APIs working.
- Move files only where necessary.
- Keep the gateway focused on routing, not duplicated business logic.

Target structure:

apps/
├── gateway/
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── app.controller.ts
│   │   └── main.ts
│   ├── test/
│   ├── package.json
│   ├── nest-cli.json
│   └── tsconfig.json
│
├── participant-application-service/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── participants/
│   │   │   ├── dto/
│   │   │   │   ├── create-participant.dto.ts
│   │   │   │   ├── update-participant.dto.ts
│   │   │   │   └── query-participant.dto.ts
│   │   │   ├── participants.controller.ts
│   │   │   ├── participants.service.ts
│   │   │   └── participants.module.ts
│   │   │
│   │   ├── applications/
│   │   │   ├── dto/
│   │   │   │   ├── create-application.dto.ts
│   │   │   │   ├── update-application.dto.ts
│   │   │   │   ├── query-application.dto.ts
│   │   │   │   └── bulk-status.dto.ts
│   │   │   ├── applications.controller.ts
│   │   │   ├── applications.service.ts
│   │   │   └── applications.module.ts
│   │   │
│   │   ├── prisma/
│   │   │   ├── prisma.module.ts
│   │   │   └── prisma.service.ts
│   │   │
│   │   ├── common/
│   │   │   ├── filters/
│   │   │   ├── interceptors/
│   │   │   └── pipes/
│   │   │
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   ├── test/
│   │   └── app.e2e-spec.ts
│   │
│   ├── package.json
│   ├── nest-cli.json
│   ├── prisma.config.ts
│   ├── tsconfig.json
│   └── tsconfig.build.json
│
└── truck-management-service/
    └── keep existing working structure

Current scope for participant-application-service:
1. Prisma integration
2. Participants API
3. Applications API
4. DTO validation

Do NOT add yet:
- Authentication
- Authorization
- Email
- QR
- Attendance
- Export
- Frontend

Also clean generated files from source control:
- dist/
- node_modules/
- src/generated/
- *.tsbuildinfo
- coverage/
- .env files

Update .gitignore accordingly.

After restructuring:
- Fix all imports
- Update AppModule imports
- Make sure Prisma still works
- Run build
- Run tests if available
- Make sure the service starts without errors

Finally report:
- Files moved
- Files created
- Files removed from Git
- Imports fixed
- Build result
- Remaining issues