import { SessionPayloadDto, TechnicalInfoDto } from '@admin/dto';

export class HomePage {
  session: SessionPayloadDto;

  technicalInfo: TechnicalInfoDto;

  public static builder(): HomePageBuilder {
    return new HomePageBuilder();
  }
}

class HomePageBuilder {
  private readonly homePage: HomePage;

  constructor() {
    this.homePage = new HomePage();
  }

  public session(session: SessionPayloadDto): HomePageBuilder {
    this.homePage.session = session;
    return this;
  }

  public technicalInfo(technicalInfo: TechnicalInfoDto): HomePageBuilder {
    this.homePage.technicalInfo = technicalInfo;
    return this;
  }

  public build(): HomePage {
    return this.homePage;
  }
}
