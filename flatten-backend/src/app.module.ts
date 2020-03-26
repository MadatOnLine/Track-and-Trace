import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QrCodeModule } from './qr-code/qr-code.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot(),
		QrCodeModule,
		TypeOrmModule.forRootAsync({
			imports: [ ConfigModule ],
			useFactory: (configService: ConfigService) => ({
				type: 'mysql',
				host: configService.get<string>('TYPEORM_HOST'),
				port: configService.get<number>('TYPEORM_PORT'),
				username: configService.get<string>('TYPEORM_USERNAME'),
				password: configService.get<string>('TYPEORM_PASSWORD'),
				database: configService.get<string>('TYPEORM_DATABASE'),
				entities: [ __dirname + '/**/*.entity{.ts,.js}' ],
				migrations: [ __dirname + '/migration/**/*{.ts,.js}' ],
				migrationsTableName: 'migration',
				cli: {
					entitiesDir: 'src/entity',
					migrationsDir: 'src/migration'
				},
				synchronize: false
			}),
			inject: [ ConfigService ]
		})
	],
	controllers: [ AppController ],
	providers: [ AppService ]
})
export class AppModule {}
