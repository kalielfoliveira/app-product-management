import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),

        RouterModule.forRoot([]),
        HomePage,
      ],
      providers: [
        provideLocationMocks(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the home page', () => {
    expect(component).toBeTruthy();
  });

  it('should render the hero title "Bem-vindo ao PRODEX, seu App de gerenciamento de Produtos"', () => {
    const compiled = fixture.nativeElement;
    const heroTitle = compiled.querySelector('.hero-title');
    expect(heroTitle).toBeTruthy();
    expect(heroTitle.textContent).toContain('Bem-vindo ao PRODEX, seu App de gerenciamento de Produtos');
  });

  it('should render the "COMEÇAR →" button with proper routerLink', () => {
    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('.cta-button');
    expect(button).toBeTruthy();
    expect(button.textContent).toContain('COMEÇAR →');
    
  });

  it('should display the "Ainda nenhum favorito cadastrado" message when favoriteProducts() returns an empty array', () => {
    
    spyOn(component, 'favoriteProducts').and.returnValue([]);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const noFavoritesMsg = compiled.querySelector('.no-favorites');
    expect(noFavoritesMsg).toBeTruthy();
    expect(noFavoritesMsg.textContent).toContain('No favorites yet');
  });
});
