import { AppModule } from '@/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { ConfigService } from './config/config.service';
import { FilteredLogger } from './utils/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new FilteredLogger('milky', {
      logLevels: ['log', 'warn', 'error', 'debug', 'verbose'],
      ignorePatterns: [
        'InstanceLoader',
        'WebSocketsController',
        'RouterExplorer',
        'RoutesResolver',
      ],
    }),
    rawBody: true,
  });

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 5000;

  app.use(
    session({
      secret: configService.get('SESSION_SECRET') || 'default_fallback_session_secret_milky',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 7 * 24 * 3600_000,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://51.21.19.92:3000',
      'http://51.21.19.92:3001',
      'http://51.21.19.92:3002',
      'https://lifekeys-shepherd.vercel.app',
      'https://lifekeysshepherd.com',
      'https://lifekeys-shepherd.com',
      'https://www.lifekeys-shepherd.com',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
  });

  app.setGlobalPrefix('api/v1');

  // validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Tavonza AI - Restaurant Management API')
    .setDescription(
      'Comprehensive API documentation for the Tavonza AI Restaurant Management platform.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/swagger', app, document, {
    customCssUrl: 'https://unpkg.com/swagger-ui-dist@5/swagger-ui.css',
    customJs: [
      'https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js',
      'https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js',
    ],
    swaggerOptions: {
      persistAuthorization: true,
      filter: true,
      displayRequestDuration: true,
    },
  });

  // 📝 Expose Swagger JSON spec
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/swagger-json', (req, res) => {
    res.json(document);
  });

  // 🌐 Server Starting
  console.log('🌐 Starting milky API Server...');
  console.log('📦 Loading modules...');

  // 🛜 CORS Configuration
  console.log('🛡️  CORS: Enabled for frontend origins');

  // 📚 API Documentation
  console.log('📚 Swagger: Available at /swagger');

  // 🚀 Final Startup
  await app.listen(port);
  console.log(`\n🚀 Server launched successfully!`);
  console.log(`🔗 Application is running on: ${await app.getUrl()}`);
  console.log(`📦 API Prefix: /api/v1`);
  console.log(`📄 Docs: ${await app.getUrl()}/swagger\n`);
}

bootstrap();
