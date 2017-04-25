import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MdIconComponent } from './md-icon.component';

describe('MdIconComponent', () => {
  let component: MdIconComponent;
  let fixture: ComponentFixture<MdIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MdIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MdIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
